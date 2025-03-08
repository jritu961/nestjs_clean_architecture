import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: './uploads', // 🔥 Make sure this folder exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
