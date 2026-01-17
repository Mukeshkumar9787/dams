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
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-dark-5"
            multiple={multiSelect}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
