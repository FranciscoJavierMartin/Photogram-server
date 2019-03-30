
export interface IFileUpload{
  name: string;
  data: any;
  enconding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  mv: Function;
}