import optModel from "../../models/Otp/optModel.js";

import { asyncErrorHandler } from "../../utils/errors/asyncErrorHandler.js";

import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { sendMail } from "../../utils/sendmail.js";
import { genrateOtp } from "../../utils/otp/otp.js";
import auth from "../../models/auth/auth.js";

export const signUp = asyncErrorHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if user exist or not in database, if user will not exist isUserAlreadyExist will give null
    const isUserAlreadyExist = await auth.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({
        status: false,
        message: "User already exist",
      });
    }

    // current date
    const currentDate = new Date();

    // deleting the expire  opt
    await optModel.deleteMany({
      expiresAt: { $lt: currentDate },
      type: "SIGNUP",
    });

    // genrate the random otp
    const otp = genrateOtp();

    sendMail(email, otp)
      .then(async () => {
        const otpDoc = await optModel.findOneAndUpdate(
          { email, type: "SIGNUP" },
          { otp, expiresAt: new Date(Date.now() + 300000) },
          { $new: true }
        );
        if (!otpDoc) {
          let doc = new optModel({
            email,
            type: "SIGNUP",
            otp,
            expiresAt: new Date(Date.now() + 300000), //expiry time of otp 5mins
          });

          await doc.save().then(() => {
            return res
              .status(200)
              .json({ success: true, message: "OTP sent successfully" });
          });
        } else {
          return res
            .status(200)
            .json({ success: true, message: "OTP sent successfully" });
        }
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          message: `Unable to send mail! ${error.message}`,
        });
      });

    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
    //   const newData = await auth.create({ ...req.body, password: hashedPassword });
    //   res.status(201).json({
    //     status: true,
    //     message: "user created successfully",
    //   });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// --------------verifyOtp for signup-----------------------
export const verifyOtp = asyncErrorHandler(async (req, res) => {
  const { email, password, otp, firstName, lastName } = req?.body;

  // --finding otp in otp model
  const isOtpValid = await optModel.findOne({ email, otp });
  if (!isOtpValid) {
    return res.status(400).json({
      status: false,
      message: "otp is incorrect",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newData = new auth({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newData.save();

  res.status(200).json({
    status: true,
    message: "verify verified",
  });
});
// --------------login controller--------------------
export const login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req?.body;
  const isUserExist = await auth.findOne({ email });
  if (!isUserExist) {
    return res.status(404).json({
      status: false,
      message: "No user found with this email",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, isUserExist?.password);
  if (!isPasswordValid) {
    return res.status(404).json({
      status: false,
      message: "wrong password",
    });
  }
  // access token
  const accessToken = jwt.sign(
    {
      id: isUserExist?._id,
      email: isUserExist?.email,
    },
    "hgy79hfg",
    { expiresIn: "15m" }
  );

  res.cookie("ACCESS_TOKEN_HOTHOUSE", accessToken, {
    httpOnly: true,
    expiresIn: "15m",
  });

  res.status(201).json({
    status: true,
    message: "login successfully",
    data: isUserExist,
  });
});

// logout controller
export const logout = asyncErrorHandler(async (req, res) => {
  try {
    res.clearCookie("ACCESS_TOKEN_HOTHOUSE");
    res.status(201).send("logout successfully");
  } catch (error) {
    res.status(500).send(`internal server error: ${error.message}`);
  }
});

// update profile controller
export const updateProfile = asyncErrorHandler(async (req, res) => {
  try {
    const { id, firstName, lastName, mobileNumber } = req.body;

    const updateUser = await auth
      .findByIdAndUpdate(
        id,
        {
          $set: {
            firstName,
            lastName,
            mobileNumber,
          },
        },
        { new: true }
      )
      .select("-password");

    if (!updateUser) {
      res.status(400).json({
        status: false,
        message: " user not exist",
      });
    }
    return res.status(201).json({
      status: true,
      message: "profile updated successfully",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).send(`internal server error :${error.message}`);
  }
});

// ------------------------reset password controller----------------------------------------
export const resetPassword = asyncErrorHandler(async (req, res) => {
  try {
    const { email, password } = req?.body;
    const isUserExist = await auth.findOne({ email });
    if (!isUserExist) {
      return res.status(404).json({
        status: false,
        message: "No user found with this email",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExist?.password
    );
    if (!isPasswordValid) {
      return res.status(404).json({
        status: false,
        message: "wrong password",
      });
    }

    // current date
    const currentDate = new Date();

    // deleting the expire  opt
    await optModel.deleteMany({
      expiresAt: { $lt: currentDate },
      type: "SIGNUP",
    });

    // genrate the random otp
    const otp = genrateOtp();

    sendMail(email, otp)
      .then(async () => {
        const otpDoc = await optModel.findOneAndUpdate(
          { email, type: "FORGOTPASSWORD" },
          { otp, expiresAt: new Date(Date.now() + 300000) },
          { $new: true }
        );
        if (!otpDoc) {
          let doc = new optModel({
            email,
            type: "FORGOTPASSWORD",
            otp,
            expiresAt: new Date(Date.now() + 300000), //expiry time of otp 5mins
          });

          await doc.save().then(() => {
            return res
              .status(200)
              .json({ success: true, message: "OTP sent successfully" });
          });
        } else {
          return res
            .status(200)
            .json({ success: true, message: "OTP sent successfully" });
        }
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          message: `Unable to send mail! ${error.message}`,
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// -----------verify otp for reset password ----------------------------
export const verifyResetPasswordOtp = asyncErrorHandler(async (req, res) => {
  const { email, newPassword, otp } = req.body;
  const isOtpValid = await optModel.findOne({ email, otp });
  if (!isOtpValid) {
    return res.status(400).json({ status: false, message: "incorrect otp" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const newPass = await auth.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { $new: true }
  );

  res.status(201).json({
    status: true,
    message: "password updated successfully",
  });
});

// delete account  controller

export const deleteAccount = asyncErrorHandler(async (req, res) => {
  const { id, email } = req?.body;
  const isuserExist = await auth.findOne({ _id: id, email });
  if (!isuserExist) {
    return res.status(400).json({
      status: false,
      message: "user not exist in database",
    });
  }

  // current date
  const currentDate = new Date();

  // deleting the expire  opt
  await optModel.deleteMany({
    expiresAt: { $lt: currentDate },
    type: "SIGNUP",
  });

  // genrate the random otp
  const otp = genrateOtp();

  sendMail(email, otp).then(async () => {
    const otpDoc = await optModel.findOneAndUpdate(
      { email, type: "FORGOTPASSWORD" },
      { otp, expiresAt: new Date(Date.now() + 300000) },
      { $new: true }
    );
    if (!otpDoc) {
      let doc = new optModel({
        email,
        type: "FORGOTPASSWORD",
        otp,
        expiresAt: new Date(Date.now() + 300000), //expiry time of otp 5mins
      });

      await doc.save().then(() => {
        return res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
      });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    }
  });
});

// ------verify otp for delete account------------
export const verifyOtpForDeleteAccount = asyncErrorHandler(async (req, res) => {
  const { email, id, otp } = req?.body;
  const userExist = await auth.findOne({ _id: id, email });
  if (!userExist) {
    return res.status(400).json({
      status: false,
      message: "user not exist in database",
    });
  }

  const isOtpValid = await optModel.findOne({ email, otp });
  if (!isOtpValid) {
    return res.status(400).json({
      status: false,
      message: "otp is incorrect",
    });
  }

  await auth.findByIdAndDelete(id);

  return res.status(201).json({
    status: true,
    message: "delete account successfully",
  });
});
