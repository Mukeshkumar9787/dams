"use client";
import { uploadFile } from "@/http/apiCalls";
import { notifyError } from "@/utils/notify";
import React from "react";

const FileUploader = ({ files, setFiles, multiSelect = false, fileIdsRef, deletedFileIdsRef }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const localFiles = multiSelect ? files : (files ? [files] : []);
  const maxFiles = multiSelect ? 5 : 1;

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

    const remainingSlots = maxFiles - localFiles.length;
    if (remainingSlots <= 0) {
      notifyError(multiSelect ? "Maximum 5 files allowed." : "Only 1 file allowed.");
      return;
    }

    const filesToUpload = imageFiles.slice(0, remainingSlots);
    if (imageFiles.length > remainingSlots) {
      notifyError(multiSelect ? "Maximum 5 files allowed." : "Only 1 file allowed.");
    }

    await Promise.all(filesToUpload.map((file) => handleFileUpload(file)));
  };

  const handleImageChange = async(e: { target: { files: FileList; value: string; }; }) => {
    const uploadedFiles = [...(e.target.files || [])];
    await processSelectedFiles(uploadedFiles);
    e.target.value = "";
  };

  const handleFileUpload = async(file: Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await uploadFile(formData);
    if(!response) return
    setFiles((prev) => {
      if(multiSelect){
        fileIdsRef.current.add(response.data.id);
        return [...prev, {...response.data}];
      }else{
        if(prev){
          let onlyFileId = prev.id;
          if(onlyFileId){
            deletedFileIdsRef.current.add(onlyFileId);
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
                <button type="button" onClick={()=> handleFileDelete(file.id)} className="mb-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600">Remove</button>
                <img
                    src={file.path}
                    alt="Preview"
                    className="h-32 w-full rounded-2xl border border-slate-200 object-cover"
                />
              </div>
          )}
        </div>
    </div>
  );
};

export default FileUploader;
