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

  const { userName, email, fullname, password } = req.body;

  if (
    [userName, email, fullname, password].some(
      "field",
      () => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this Email or Username is already exist, Please try with another Email or Username"
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
});

if (!avatar) {
  throw new ApiError(400, "Avatar is required");
}

const user = await User.create({
  fullname,
  userName: userName.toLowerCase(),
  email,
  password,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
});

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
);

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
)

export { registerUser };
