"use client";
import { uploadFile } from "@/http/apiCalls";
import { notifyError } from "@/utils/notify";
import React from "react";

const CROP_BOX_SIZE = 320;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const cropImageFile = async ({
  file,
  zoom,
  cropShape,
}: {
  file: File;
  zoom: number;
  cropShape: "round" | "square";
}) => {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);
    const canvas = document.createElement("canvas");
    canvas.width = CROP_BOX_SIZE;
    canvas.height = CROP_BOX_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not initialize crop canvas");
    }

    const baseScale = Math.max(CROP_BOX_SIZE / image.width, CROP_BOX_SIZE / image.height);
    const renderedWidth = image.width * baseScale * zoom;
    const renderedHeight = image.height * baseScale * zoom;
    const offsetX = Math.max(0, (renderedWidth - CROP_BOX_SIZE) / 2);
    const offsetY = Math.max(0, (renderedHeight - CROP_BOX_SIZE) / 2);

    ctx.clearRect(0, 0, CROP_BOX_SIZE, CROP_BOX_SIZE);

    if (cropShape === "round") {
      ctx.beginPath();
      ctx.arc(CROP_BOX_SIZE / 2, CROP_BOX_SIZE / 2, CROP_BOX_SIZE / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }

    ctx.drawImage(image, -offsetX, -offsetY, renderedWidth, renderedHeight);

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

const FileUploader = ({
  files,
  setFiles,
  multiSelect = false,
  fileIdsRef,
  deletedFileIdsRef,
  cropShape = "square",
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [cropSource, setCropSource] = React.useState<string | null>(null);
  const [pendingCropFile, setPendingCropFile] = React.useState<File | null>(null);
  const [cropZoom, setCropZoom] = React.useState(1);
  const localFiles = multiSelect ? files : (files ? [files] : []);
  const maxFiles = multiSelect ? 5 : 1;
  const cropResolverRef = React.useRef<((value: File | null) => void) | null>(null);

  const resetCropState = React.useCallback(() => {
    if (cropSource) {
      URL.revokeObjectURL(cropSource);
    }
    setCropSource(null);
    setPendingCropFile(null);
    setCropZoom(1);
  }, [cropSource]);

  const openCropper = React.useCallback((file: File) => {
    const source = URL.createObjectURL(file);
    setCropSource(source);
    setPendingCropFile(file);
    setCropZoom(1);

    return new Promise<File | null>((resolve) => {
      cropResolverRef.current = resolve;
    });
  }, []);

  const confirmCrop = React.useCallback(async () => {
    if (!pendingCropFile) return;

    try {
      const croppedFile = await cropImageFile({
        file: pendingCropFile,
        zoom: cropZoom,
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
  }, [cropShape, cropZoom, pendingCropFile, resetCropState]);

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
    const uploadedFiles = [...(e.target.files || [])];
    await processSelectedFiles(uploadedFiles);
    e.target.value = "";
  };

  const handleFileUpload = async(file: Blob) => {
    const response = await uploadFile(file);
    if(!response) return
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
    const droppedFiles = [...(e.dataTransfer.files || [])].filter((file) =>
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
                <div
                  className={`relative mx-auto h-[320px] w-[320px] overflow-hidden bg-slate-200 ${
                    cropShape === "round" ? "rounded-full" : "rounded-[28px]"
                  }`}
                >
                  <img
                    src={cropSource}
                    alt="Crop preview"
                    className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
                    style={{
                      width: `calc(100% * ${cropZoom})`,
                      height: `calc(100% * ${cropZoom})`,
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-slate-950/35" />
                  <div
                    className={`pointer-events-none absolute inset-0 border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.38)] ${
                      cropShape === "round" ? "rounded-full" : "rounded-[28px]"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Zoom</span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={cropZoom}
                    onChange={(e) => setCropZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </label>
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
        <label
          className={`flex min-h-[124px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed px-5 py-6 text-center transition ${
            isDragging
              ? "border-sky-500 bg-sky-50/80 shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
              : "border-slate-300 bg-slate-50/80 hover:border-sky-400 hover:bg-sky-50/60"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span className="text-sm font-semibold text-slate-900">Upload images</span>
          <span className="mt-1 text-sm text-slate-500">Click or drag and drop to attach storefront-ready media.</span>
          <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            {multiSelect ? `Up to ${maxFiles} images` : "Single image"}
          </span>
          <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple={multiSelect}
          />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {localFiles.map((file: { id: number, path: string }) => 
              <div key={file.id} className="overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2 shadow-sm">
                <button type="button" onClick={()=> handleFileDelete(file.id)} className="mb-2 inline-flex rounded-full bg-slate-100 px-1 py-1 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600">Remove</button>
                <img
                    src={file.path}
                    alt="Preview"
                    className={cropShape === "round" ? "mx-auto w-32 rounded-full border border-slate-200 object-cover" : "h-32 w-full rounded-2xl border border-slate-200 object-cover"}
                />
              </div>
          )}
        </div>
    </div>
  );
};

export default FileUploader;
