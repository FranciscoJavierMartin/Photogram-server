import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

import { IFileUpload } from "./interfaces/file-upload.interface";

export default class FileSystem{

  constructor(){};

  saveTempImage(file: IFileUpload, userId:string){

    return new Promise((resolve, reject) => {
      const path = this.createUserFolder(userId);

      const fileName = this.generateUniqueFileName(file.name);
  
      file.mv(`${path}/${fileName}`, (err:any) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
 
  }

  moveImagesFromTempToPost(userId: string): string[]{
    let res: string[] = [];
    const pathUserTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
    const pathUserPost = path.resolve(__dirname, '../uploads', userId, 'posts');

    if(!fs.existsSync(pathUserTemp)){
      res = [];
    } else if(!fs.existsSync(pathUserPost)){
      fs.mkdirSync(pathUserPost);
    } else {
      const imagesTemp = this.getTempImages(userId, pathUserTemp);
      imagesTemp.forEach(image => {
        fs.renameSync(`${pathUserTemp}/${image}`, `${pathUserPost}/${image}`)
      });

      res = imagesTemp;
    }

    return res;
  }

  getPhotoURL(userId: string, image: string): string {
    let pathPhoto: string = path.resolve(__dirname, '../uploads/', userId, 'posts', image);

    if(!fs.existsSync(pathPhoto)){
      pathPhoto = path.resolve(__dirname, '../assets/400x250.jpg');
    }

    return pathPhoto;
  }

  private createUserFolder(userId: string): string{
    const pathUser = path.resolve(__dirname, '../uploads', userId);
    const pathUserTemp = pathUser + '/temp';

    const exist = fs.existsSync(pathUser);

    if(!exist){
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }

    return pathUserTemp;
  }

  private generateUniqueFileName(originalFilename: string): string{
    const nameArray = originalFilename.split('.');
    const extension = nameArray[nameArray.length-1];

    const idUnique = uniqid();

    return `${idUnique}.${extension}`;
  }

  private getTempImages(userId: string, pathUserTemp: string){
    return fs.readdirSync(pathUserTemp) || [];
  }

}