import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    const {fullName,email,username,password} = req.body
    // validation
    if(
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ){
        throw new apiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new apiError(409,"User with email or username already exist")
    }
    console.warn(req.files)
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is missing")
    }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // let coverImage = ""
    // if (coverLocalPath){
    //     const coverImage = await uploadOnCloudinary(coverImage)
    // }
    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("Uploaded avatar",avatar)
    } catch (error) {
        console.log("Error uploading avatar",error)
        throw new apiError(500,"Failed to upload to Avatar")
    }
    let coverImage;
    try {
        coverImage = await uploadOnCloudinary(coverLocalPath)
        console.log("Uploaded coverImage",coverImage)
    } catch (error) {
        console.log("Error uploading coverImage",error)
        throw new apiError(500,"Failed to upload to coverImage")
    }
    try {
        const user = await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username:username.toLowerCase()
        })
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        if(!createdUser){
            throw new apiError(500,"Something went wrong while registering the user")
        }
    
        return res
                .status(201)
                .json(new apiResponse(200,createdUser,"User registered Successfully"))
    } catch (error) {
        console.log("User creation failed")

        if (avatar) {
            const deletionResult = await deleteFromCloudinary(avatar.public_id);
            if (!deletionResult) {
                console.log("Failed to delete avatar after user creation failure");
            }
        }
        if (coverImage) {
            const deletionResult = await deleteFromCloudinary(coverImage.public_id);
            if (!deletionResult) {
                console.log("Failed to delete cover image after user creation failure");
            }
        }
        throw new apiError(500,"Something went wrong while registering the user and images were deleted")
    }

})


export {registerUser}