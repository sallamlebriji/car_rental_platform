import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("src/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  }
});

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const documentMimeTypes = new Set([
  ...imageMimeTypes,
  "application/pdf"
]);

function createUploader(allowedMimeTypes, errorMessage) {
  return multer({
    storage,
    limits: {
      fileSize: 8 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        return cb(new Error(errorMessage));
      }
      return cb(null, true);
    }
  });
}

export const upload = createUploader(
  imageMimeTypes,
  "Seuls les fichiers image JPG, PNG ou WEBP sont autorises."
);

export const uploadDocument = createUploader(
  documentMimeTypes,
  "Seuls les fichiers JPG, PNG, WEBP ou PDF sont autorises."
);
