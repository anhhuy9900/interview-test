import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const uploadStorage = (): multer.Multer => {
  const upload = multer({ dest: os.tmpdir() });
  return upload;
};

export const generateFileName = (fileName: string, extension: string | null = null): string => {
  const fileNameArray = fileName ? fileName.split('.') : [];
  const fileNameExt = extension ? extension : fileNameArray[fileNameArray.length - 1];
  const fileNameWithoutExt = fileName.replace(`.${fileNameExt}`, '');
  const fileNameGenerated = `${fileNameWithoutExt}_${uuidv4()}`;
  return `${fileNameGenerated}.${fileNameExt}`;
};

export const createFolder = async (folderPath: string) => {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  } catch (err) {
    console.log('🚀 ~ CreateFolder ~ err:', err);
  }
};

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const covertBytesToMb = (fileSizeBytes: number) => {
  return (fileSizeBytes / 1024 ** 2).toFixed(2);
};

export const covertMbToByte = (fileSizeMB: number) => {
  return fileSizeMB * 1024 ** 2;
};
