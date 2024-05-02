import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  /*
    get user details
    validatation of received data
    check if user already exist
    upload avatar & coverImage
    check for avatar upload or not
    save data to db
    send response but extract to password & refresh token
    check for user cration 
    send response
    */

  const { userName, email, fullName, password } = req.body;

//   validatation of received data
  if (
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

//   check if user already exist
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this Email or Username is already exist, Please try with another Email or Username"
    );
  }

// upload avatar & coverImage
  const avatarLocalPath = req.files?.avatar[0]?.path;
//   const coverImageLocalPath = req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
   coverImageLocalPath= req.files.coverImage[0].path
}

//     check for avatar upload or not
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

//   save data to db
  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

    // send response but extract to password & refresh token   
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

//   return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
