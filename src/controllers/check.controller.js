import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const checkController = asyncHandler(async (req,res) => {
    return res.status(200)
              .json(new apiResponse(200,"OK","Check Passed"))
})

export {checkController}