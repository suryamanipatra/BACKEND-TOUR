import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
// configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET = SVZtxKJL8KwhRR9Z2b7nfeOYCXA

});


const uploadOnCloudinary = async(localFilePath) => {
    try {
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
        fs.unlinkSync(localFilePath)
        return null 
    }
}

export {uploadOnCloudinary}