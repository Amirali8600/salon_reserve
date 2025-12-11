import fs from "fs";
import path from "path";

export class StorageManageUtils{
    static async deleteFile(filePath:string){
        const fullPath=path.join(__dirname,'..','..',filePath);
  if (await fs.existsSync(fullPath)) {
    await fs.promises.unlink(fullPath).then(() => {
      console.log("Image deleted successfully");
    }).catch((err) => {
      console.error("Error deleting image:", err);
    });
    
  }else{
    console.log("Image not found");
  }

    }
}