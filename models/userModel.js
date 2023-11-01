import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true, 
        unique: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true, 
        validate: {
            validator: (value) => /\S+@\S+\.\S+/.test(value), 
            message: "Invalid email format",
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "developer",
        enum: ["developer", "employer"], 
        immutable: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    refreshToken: String,
}, {
    timestamps: true, 
});

const User = mongoose.model("User", userSchema);

export default User;
