"use client";
import { uploadFile } from "@/http/apiCalls";
import { notifyError } from "@/utils/notify";
import React from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";

const DEFAULT_ASPECT = 1;
const MIN_CROP_SIZE = 160;

const toNaturalPixelCrop = (nextCrop: Crop, image: HTMLImageElement): PixelCrop => {
  const renderedCrop = convertToPixelCrop(nextCrop, image.width, image.height);
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  return {
    ...renderedCrop,
    x: Math.floor(renderedCrop.x * scaleX),
    y: Math.floor(renderedCrop.y * scaleY),
    width: Math.floor(renderedCrop.width * scaleX),
    height: Math.floor(renderedCrop.height * scaleY),
  };
};

const cropImageFile = async ({
  file,
  crop,
  cropShape,
}: {
  file: File;
  crop: PixelCrop;
  cropShape: "round" | "square";
}) => {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const loadedImage = new window.Image();
      loadedImage.onload = () => resolve(loadedImage);
      loadedImage.onerror = reject;
      loadedImage.src = imageUrl;
    });
    const canvas = document.createElement("canvas");
    const width = Math.max(1, Math.floor(crop.width));
    const height = Math.max(1, Math.floor(crop.height));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not initialize crop canvas");
    }

    ctx.clearRect(0, 0, width, height);

    if (cropShape === "round") {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      width,
      height
    );

    const outputType = cropShape === "round" ? "image/png" : file.type || "image/jpeg";
    const extension = cropShape === "round" ? "png" : (file.name.split(".").pop() || "jpg");

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((createdBlob) => resolve(createdBlob), outputType, 0.92);
    });

    if (!blob) {
      throw new Error("Failed to export cropped image");
    }

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "image"}-cropped.${extension}`, {
      type: outputType,
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

type TriggerProps = {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  dragHandlers: {
    onDragOver: (event: React.DragEvent<HTMLLabelElement>) => void;
    onDragLeave: (event: React.DragEvent<HTMLLabelElement>) => void;
    onDrop: (event: React.DragEvent<HTMLLabelElement>) => void;
  };
  isDragging: boolean;
};

const FileUploader = ({
  files,
  setFiles,
  multiSelect = false,
  fileIdsRef,
  deletedFileIdsRef,
  cropShape = "square",
  hideDropzone = false,
  hidePreviewList = false,
  renderTrigger,
  onFileUploaded,
}: {
  files: any;
  setFiles: React.Dispatch<React.SetStateAction<any>>;
  multiSelect?: boolean;
  fileIdsRef: React.MutableRefObject<Set<number>>;
  deletedFileIdsRef: React.MutableRefObject<Set<number>>;
  cropShape?: "round" | "square";
  hideDropzone?: boolean;
  hidePreviewList?: boolean;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  onFileUploaded?: (file: any) => void;
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [cropSource, setCropSource] = React.useState<string | null>(null);
  const [pendingCropFile, setPendingCropFile] = React.useState<File | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const localFiles = multiSelect ? files : (files ? [files] : []);
  const maxFiles = multiSelect ? 5 : 1;
  const cropResolverRef = React.useRef<((value: File | null) => void) | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  const resetCropState = React.useCallback(() => {
    if (cropSource) {
      URL.revokeObjectURL(cropSource);
    }
    setCropSource(null);
    setPendingCropFile(null);
    setCrop(undefined);
    setCompletedCrop(null);
    imageRef.current = null;
  }, [cropSource]);

  const openCropper = React.useCallback((file: File) => {
    const source = URL.createObjectURL(file);
    setCropSource(source);
    setPendingCropFile(file);
    setCrop(undefined);
    setCompletedCrop(null);

    return new Promise<File | null>((resolve) => {
      cropResolverRef.current = resolve;
    });
  }, []);

  const confirmCrop = React.useCallback(async () => {
    if (!pendingCropFile || !completedCrop || completedCrop.width <= 0 || completedCrop.height <= 0) {
      notifyError("Please select a crop area.");
      return;
    }

    try {
      const croppedFile = await cropImageFile({
        file: pendingCropFile,
        crop: completedCrop,
        cropShape,
      });

      cropResolverRef.current?.(croppedFile);
    } catch (error) {
      notifyError("Could not crop image.");
      cropResolverRef.current?.(null);
    } finally {
      cropResolverRef.current = null;
      resetCropState();
    }
  }, [completedCrop, cropShape, pendingCropFile, resetCropState]);

  const cancelCrop = React.useCallback(() => {
    cropResolverRef.current?.(null);
    cropResolverRef.current = null;
    resetCropState();
  }, [resetCropState]);

  const processSelectedFiles = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      notifyError("Only image files are allowed.");
      return;
    }
    if (imageFiles.length !== selectedFiles.length) {
      notifyError("Only image files are allowed.");
    }

    const filesToUpload = multiSelect
      ? imageFiles.slice(0, maxFiles - localFiles.length)
      : imageFiles.slice(-1);

    if (multiSelect) {
      const remainingSlots = maxFiles - localFiles.length;
      if (remainingSlots <= 0) {
        notifyError("Maximum 5 files allowed.");
        return;
      }

      if (imageFiles.length > remainingSlots) {
        notifyError("Maximum 5 files allowed.");
      }
    }

    for (const file of filesToUpload) {
      const croppedFile = await openCropper(file);
      if (!croppedFile) {
        continue;
      }
      await handleFileUpload(croppedFile);
    }
  };

  const handleImageChange = async(e: { target: { files: FileList; value: string; }; }) => {
    const uploadedFiles = Array.from(e.target.files || []);
    await processSelectedFiles(uploadedFiles);
    e.target.value = "";
  };

  const handleFileUpload = async(file: Blob) => {
    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      if(!response) return;

      setFiles((prev) => {
        if(multiSelect){
          fileIdsRef.current.add(response.data.id);
          return [...prev, {...response.data}];
        }else{
          if(prev){
            let onlyFileId = prev.id;
            if(onlyFileId){
              if(fileIdsRef.current.has(onlyFileId)){
                fileIdsRef.current.delete(onlyFileId);
              }else{
                deletedFileIdsRef.current.add(onlyFileId);
              }
            };
          };
          fileIdsRef.current.add(response.data.id);
        }
        return response.data;
      })
      onFileUploaded?.(response.data);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (droppedFiles.length === 0) {
      notifyError("Only image files are allowed.");
      return;
    }
    await processSelectedFiles(droppedFiles);
  };

  const handleFileDelete = (id:number) => {
    if(multiSelect){
      setFiles(prev => prev.filter(i => i.id !== id));
    }else{
      setFiles(null);
    }
    if(!id) return;
    deletedFileIdsRef.current.add(id);
    if(fileIdsRef.current.has(id)){
      fileIdsRef.current.delete(id)
    }
  }
  const dragHandlers = {
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    type: "file",
    accept: "image/*",
    onChange: handleImageChange,
    multiple: multiSelect,
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCropImageLoad = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = event.currentTarget;

    imageRef.current = event.currentTarget;

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 80,
        },
        DEFAULT_ASPECT,
        width,
        height
      ),
      width,
      height
    );

    setCrop(initialCrop);
    setCompletedCrop(toNaturalPixelCrop(initialCrop, event.currentTarget));
  }, []);

  const triggerProps: TriggerProps = {
    inputProps,
    inputRef,
    dragHandlers,
    isDragging,
  };

  return (
    <div className="mb-5">
        {cropSource ? (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/70 px-4 py-6">
            <div className="w-full max-w-[540px] rounded-[28px] bg-white p-5 shadow-2xl sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Crop image</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {cropShape === "round" ? "Adjust the circular crop for the profile image." : "Adjust the square crop before upload."}
                </p>
              </div>

              <div className="rounded-[24px] bg-slate-100 p-4">
                <div className="mx-auto max-w-[420px] overflow-hidden rounded-[28px] bg-slate-200">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => {
                      setCrop(percentCrop);
                    }}
                    onComplete={(_, percentCrop) => {
                      if (!imageRef.current) return;
                      setCompletedCrop(toNaturalPixelCrop(percentCrop, imageRef.current));
                    }}
                    aspect={DEFAULT_ASPECT}
                    circularCrop={cropShape === "round"}
                    minWidth={MIN_CROP_SIZE}
                    keepSelection
                    className="max-h-[70vh] w-full"
                  >
                    <img
                      src={cropSource}
                      alt="Crop preview"
                      onLoad={handleCropImageLoad}
                      className="max-h-[70vh] w-full object-contain"
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelCrop}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmCrop}
                  className="rounded-xl bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {renderTrigger ? (
          renderTrigger(triggerProps)
        ) : !hideDropzone ? (
          <div className="relative overflow-hidden rounded-[24px]">
            <label
              className={`flex min-h-[124px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed px-5 py-6 text-center transition ${
                isDragging
                  ? "border-sky-500 bg-sky-50/80 shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
                  : "border-slate-300 bg-slate-50/80 hover:border-sky-400 hover:bg-sky-50/60"
              }`}
              {...dragHandlers}
            >
              <span className="text-sm font-semibold text-slate-900">Upload images</span>
              <span className="mt-1 text-sm text-slate-500">Click or drag and drop to attach storefront-ready media.</span>
              <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                {multiSelect ? `Up to ${maxFiles} images` : "Single image"}
              </span>
              <input {...inputProps} ref={inputRef} className="hidden" />
            </label>
            {isUploading && (
              <div className="absolute inset-0 z-[10] flex items-center justify-center rounded-[24px] bg-white/70">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue border-t-transparent"></div>
                  <p className="text-xs font-semibold text-slate-600">Uploading image...</p>
                </div>
              </div>
            )}
          </div>
        ) : null}
        {!hidePreviewList ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {localFiles.map((file: { id: number, path: string }) => (
              <div key={file.id} className="overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2 shadow-sm">
                <button type="button" onClick={()=> handleFileDelete(file.id)} className="mb-2 inline-flex rounded-full bg-slate-100 px-1 py-1 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600">Remove</button>
                <img
                    src={file.path}
                    alt="Preview"
                    className={cropShape === "round" ? "mx-auto w-32 rounded-full border border-slate-200 object-cover" : "h-32 w-full rounded-2xl border border-slate-200 object-cover"}
                />
              </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default FileUploader;
