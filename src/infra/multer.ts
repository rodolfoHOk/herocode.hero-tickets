import multer from 'multer';
import path from 'path';
import crypto from 'node:crypto';

const upload = multer({
  dest: path.resolve(__dirname, '..', 'temp', 'uploads'),
  limits: { fieldSize: 1024 + 1024 * 2 },
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'temp', 'uploads'));
    },
    filename(req, file, callback) {
      const filename = `${crypto.randomBytes(20).toString('hex')}${
        file.originalname
      }`;

      callback(null, filename);
    },
  }),
});

export { upload };
