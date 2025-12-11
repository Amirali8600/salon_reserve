import { Callback } from 'mongoose';
import multer from 'multer';
const storage: multer.StorageEngine = multer.diskStorage({

    destination: (req:Request, file:multer.File, cb:Callback):void => {
      cb(null, 'images/') // change the destination folder as per your requirement
    },
    filename: (req:Request, file:multer.File, cb:Callback):void => {
      cb(null,"image"+Date.now()+'.jpg')
    }
  })
  
  const fileFilter: (req:Request, file:multer.File, cb:Callback) => void = (req:Request, file:multer.File, cb:Callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    }
    if(file.size>10*1024*1024){
      cb(new Error('File size exceeds 10MB!'), false);
    }
    else {
        cb(new Error('Invalid file type, only JPEG, PNG and JPG is allowed!'), false);
    }
  };
  
  
 export const upload: multer.Multer= multer({ 
    storage: storage,
    fileFilter: fileFilter
  });
