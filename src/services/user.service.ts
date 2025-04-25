import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import { IUser } from "../interfaces/user.interface";
import { LoginResponse } from "../types";
import { sendEmail } from "../utils/email";

export const signUpUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<IUser> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ErrorHandler(400, "Email already exists");
  }

  const verificationToken = jwt.sign(
    { email },
    process.env.JWT_SECRET as string,
    { expiresIn: "30m" }
  );

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    verificationToken,
    verificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
  });

  await user.save();
  const verificationLink = `${process.env.FRONT_END_URL}/verify-email?token=${verificationToken}`;
  console.log("Verification link:", verificationLink);
  await sendEmail(
    user.email,
    "Email Verification",
    "../views/verifyEmail.templete.html",
    { verificationLink }
  );
  return user;
};

export const verifyUserEmail = async (token: string): Promise<IUser> => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });
console.log("user data from user service file",user)
    if (!user || user.verificationTokenExpiry < new Date()) {
      throw new ErrorHandler(400, "Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = "";
    user.verificationTokenExpiry = new Date(0);
    await user.save();

    return user;
  } catch (error) {
    console.error("Error in verifyUserEmail:", error);
    throw new ErrorHandler(400, "Failed to verify email");
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorHandler(400, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new ErrorHandler(
      400,
      "Account not verified. Please check your email."
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ErrorHandler(400, "Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive, // Add isActive to the user object
      profilePic: user.profilePic,
      gender: user.gender,
      paymentStatus: user.paymentStatus,
    },
    token,
  };
};
