"use client";
import { uploadFile } from "@/http/apiCalls";
import React from "react";

const FileUploader = ({ files, setFiles, multiSelect = false }) => {
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

  return (
    <div className="mb-5">
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={localFiles.length === 0}
            className="block w-full text-sm text-dark-5"
        />
        {localFiles.map((file: { id: number, path: string }) => 
            <div key={file.id} className="mt-4">
              <img
                  src={file.path}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
        )}
    </div>
  );
};

export default FileUploader;
