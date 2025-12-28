"use client";
import { uploadFile } from "@/http/apiCalls";
import React from "react";

const FileUploader = ({ files, setFiles, multiSelect = false, fileIdsRef, deletedFileIdsRef }) => {
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
    if(!response) return
    setFiles((prev) => {
      if(multiSelect){
        return [...prev, {...response.data}];
      }
      return response.data;
    })
    if(!multiSelect && fileIdsRef.current.size > 0){
      let onlyFileId = [...fileIdsRef.current][0];
      deletedFileIdsRef.current.add(onlyFileId);
      fileIdsRef.current.delete(onlyFileId);
    }
    fileIdsRef.current.add(response.data.id);
  };

  const handleFileDelete = (id:number) => {
    if(multiSelect){
      setFiles(prev => prev.filter(i => i.id !== id));
    }else{
      setFiles(null);
    }
    deletedFileIdsRef.current.add(id);
    if(fileIdsRef.current.has(id)){
      fileIdsRef.current.delete(id)
    }
  }
  return (
    <div className="mb-5">
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-dark-5"
            multiple={multiSelect}
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
