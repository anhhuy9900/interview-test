import { IsDefined, IsInt, Max } from 'class-validator';
import { MAXIMUM_FILE_SIZE_UPLOAD } from '../../../config';
import { covertBytesToMb } from '../../../utils/index'

const maxFileSize = Number(MAXIMUM_FILE_SIZE_UPLOAD);

export class UploadFileDto {
  @IsDefined({ message: 'Please choose a file to upload' })
  fieldname!: string;

  @IsInt()
  @Max(maxFileSize, { message: `File size too largest. Only upload file smaller < ${covertBytesToMb(maxFileSize)} MB` })
  size!: number;
}
