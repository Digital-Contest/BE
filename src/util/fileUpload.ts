import multer from 'multer';

export const upload = () =>{
    const storage = multer.memoryStorage();
    return multer({ storage });
}