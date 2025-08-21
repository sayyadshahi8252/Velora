import multer from "multer";

// Use memory storage for serverless (Vercel) environments
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
