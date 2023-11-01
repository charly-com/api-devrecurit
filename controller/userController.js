import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
const { v4: uuidv4 } = require("uuid");
import transporter from "../utils/mail.js";
import { generateUsersToken, generateRefreshToken, verifyRefreshToken } from "../utils/generateUsersToken.js";

export const signup = async (req, res) => {
  try {
    const otp = uuidv4().substring(0, 6);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
    });

    // Send the OTP to the user's email
    const mailOptions = {
      from: "devcharles40@gmail.com",
      to: req.body.email,
      subject: "Verification Code for Signup",
      text: `Your OTP for signup is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to send OTP." });
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          message: "OTP sent to your email for verification.",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create a new user." });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId, otp } = req.body; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (otp !== user.otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    user.isVerified = true;

    user.otp = null;
    await user.save();

    res.status(200).json({ message: "User successfully verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Verification failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate and store the refresh token
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });
    user.refreshToken = refreshToken;
    await user.save();

    // Generate and return a token upon successful login
    const userData = { id: user.id, email: user.email };
    const token = generateUsersToken(userData);

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Route for initiating the password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a secure token (e.g., using crypto.randomBytes) and save it in the user's record
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send the password reset email
    const mailOptions = {
      from: "devcharles40@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click the following link to reset your password: <a href="https://localhost/3000/reset-password/${resetToken}">Reset Password</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Failed to send password reset email." });
      } else {
        console.log("Password reset email sent: " + info.response);
        res
          .status(200)
          .json({ message: "Password reset link sent to your email." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Password reset request failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Password reset failed" });
  }
};


export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
      const decoded = verifyRefreshToken(refreshToken);
      // If verification is successful, issue a new access token
      const newAccessToken = generateUsersToken(decoded);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired refresh token" });
    }
  };
