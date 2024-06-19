import optModel from "../../models/Otp/optModel.js";
import auth from "../../models/auth/auth.js";
import { asyncErrorHandler } from "../../utils/errors/asyncErrorHandler.js";

import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { sendMail } from "../../utils/sendmail.js";
import { genrateOtp } from "../../utils/otp/otp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const signUp = asyncErrorHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if user exist or not in database, if user will not exist isUserAlreadyExist will give null
    const isUserAlreadyExist = await auth.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({
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