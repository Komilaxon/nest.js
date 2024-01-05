import multer from 'multer';
import { extname } from 'path';

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, './uploads');
  },

  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });
