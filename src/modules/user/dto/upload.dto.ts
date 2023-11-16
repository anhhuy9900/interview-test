import { IsDefined, IsInt, Max } from 'class-validator';
import { MAXIMUM_FILE_SIZE_UPLOAD } from '../../../config';

const maxFileSize = Number(MAXIMUM_FILE_SIZE_UPLOAD);

export class UploadFileDto {
  @IsDefined({ message: 'Please choose a file to upload' })
  fieldname!: string;

  @IsInt()
  @Max(maxFileSize, { message: 'File size too largest' })
  size!: number;
}
