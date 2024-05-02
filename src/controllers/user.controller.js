import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser = asyncHandler( async (req,res)=>{
  res.status(200).json({
        message:"ok"
    })
})

const getInfo = async ()=>{
res.status(201).json({
    message:"ok"
})
}

export {registerUser}