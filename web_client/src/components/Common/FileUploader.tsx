"use client";
import { uploadFile } from "@/http/apiCalls";
import React from "react";

const FileUploader = ({ files, setFiles, multiSelect = false, setDeletedFiles = null }) => {
  let localFiles = multiSelect ? files : (files ? [files] : []);
  const handleImageChange = async(e: { target: { files: any; }; }) => {
    const uploadedFiles = [...(e.target.files)];
    if (uploadedFiles.length === 0) return;
    await Promise.all(uploadedFiles.map((file: any) => handleFileUpload(file)));
  };

  const handleFileUpload = async(file: Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await uploadFile(formData);
    setFiles((prev) => {
      if(multiSelect){
        return [...prev, {...response.data}]
      }
      return response.data;
    })
  };

  const handleFileDelete = (id:number) => {
    setFiles(prev => prev.filter(i => i.id !== id));
    if(setDeletedFiles){
      setDeletedFiles(prev => [...prev, id]);
    }
  }

  return (
    <div className="mb-5">
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={localFiles.length === 0}
            className="block w-full text-sm text-dark-5"
        />
        <div className="flex flex-col gap-2">
          {localFiles.map((file: { id: number, path: string }) => 
              <div key={file.id} className="mt-4 w-32 w-32">
                <button type="button" onClick={()=> handleFileDelete(file.id)} className="flex w-full text-end">X</button>
                <img
                    src={file.path}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
          )}
        </div>
    </div>
  );
};

export default FileUploader;
