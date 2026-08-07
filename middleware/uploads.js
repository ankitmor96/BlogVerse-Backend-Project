import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";



// const storage = new CloudinaryStorage({
//     cloudinary,
//     params:{
//         folder: "Bloug",
//         allowed_formats:["jpg","jpeg","png","webp"],
//         transformation:[
//             {
//                 height:"500",
//                 width:"500",
//                 crop:"limit"
//             },
//             {
//                 fetch_format:"webp",
//             },
//             {
//                 quality:"auto",
//             },

//         ],
//     },
// });

// const uploads = multer ({
//     storage,
//     limits:{
//           fileSize: 20*1024*1024,
//     },
// });

const createUploads = ({
    folder,
    Transformation = [],
    allowed_formats = [],
    resource_type = "auto",
    fileSize = 1024 * 1024 * 20,
    MimeType = [],
}) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            return {
                folder,
                Transformation,
                allowed_formats,
                resource_type
            };
        },
    });

    return multer ({
        storage,
        limits:{
            fileSize
        },
        fileFilter:(req,file,cb)=>{
         if(MimeType.length && !MimeType.includes(file.mimetype)){
            return cb (new Error(`please enter valid mimtype , allowed mimtype : ${MimeType.join(", ")} `),false);
         }
        },
    });
};

export const BlogUploads = createUploads({
    folder: "BlogVerse/coverImage",
    allowed_formats: ["jpg","jpeg","png","webp"],
    MimeType: [
        "image/jpg",
        "image/png",
        "image/jpeg",
    ]
});

export const UserUploads = createUploads({
    folder : "BlogVerse/ProfileImage",
    allowed_formats : ["jpg","jpeg","png","webp"],
    MimeType : [
        "image/jpg",
        "image/png",
        "image/jpeg"
    ],
});

export default createUploads;