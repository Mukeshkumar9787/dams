import prisma from "../prisma/client.js";
import { convertToFullFilePath } from "../utils/helpers.js";

/**
 * Create File
 */
const createFile = async ({ path }) => {
  
  const file = await prisma.file.create({
    data: {
      path
    },
  });

  return {
    id: file.id,
    path: convertToFullFilePath(file.path),
  };
};

const updateFilesByIds = async ({ tx=prisma, feature, featureId, fileIds=[], deletedFileIds=[]}) => {
  let fileUploadPromise = [];
  if(fileIds.length > 0){
    fileUploadPromise = tx.file.updateManyAndReturn({ 
        select: {id: true, path: true},
        where: { id: { in: fileIds } },
        data: { feature, featureId }
      });
  }

  let deleteFilesPromise = [];
  
  if(deletedFileIds.length > 0){
    deleteFilesPromise = tx.file.deleteMany({ 
        select: {id: true, path: true},
        where: { id: { in: deletedFileIds } },
        data: { deletedAt: new Date() }
      });
  }
  
  const [updatedRecords, deletedRecords] = await Promise.all([
    fileUploadPromise,
    deleteFilesPromise
  ]);

  return {
    updatedRecords,
    deletedRecords
  }
}

export default {
  createFile,
  updateFilesByIds
};
