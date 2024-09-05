import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from "dotenv"

dotenv.config()

// configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async(localFilePath) => {
    try {
        console.log("Cloudinary config : ",{ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(
            localFilePath, {
                resource_type:"auto"
            }
        )
        console.log("File uploaded on Cloudinary. File src: " + response.url)
        //once the file is uploaded, we would like to delete it from our server
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("Error on cloudinary",error)
        fs.unlinkSync(localFilePath)
        return null 
    }
}

const deleteFromCloudinary = async (publicId) =>{
    try {
       const result =  await cloudinary.uploader.destroy(publicId)
       if (result.result !== 'ok') {
        console.log("Failed to delete from Cloudinary. Public ID:", publicId);
        return null;
    }
       console.log("Deleted from coludinary. Public ID",publicId)
       return result;
    } catch (error) {
        console.log("Error deleting from cloudinary:",error)
        return null
    }
}

export {uploadOnCloudinary,deleteFromCloudinary}