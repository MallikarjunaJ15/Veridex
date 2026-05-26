"use server";
import connectDb from "@/app/lib/db";
import userModel from "@/app/models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "@/app/lib/generateToken";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
export async function register(formData) {
  try {
    await connectDb();
    const { fullname, email, password } = formData;
    if (!fullname || !email || !password) {
      return { error: "Missing fields" };
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return { error: "User exists" };
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user._id);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });

    return { success: true, message: "Registered successfully" };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export const loginUser = async (formData) => {
  try {
    await connectDb();
    const { email, password } = formData;
    if (!email || !password) {
      return { error: "Please provide email and password" };
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }
    const token = generateToken(user._id);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return { success: true, message: "Welcome to Veridex" };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
};

export const logoutUser = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
  } catch (error) {
    return { error: "Internal Server Error" };
  }
};

export const generateUserFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId;
  } catch (error) {}
};

export const getme = async () => {
  try {
    await connectDb();
    const userId = await generateUserFromToken();
    if (!userId) return { user: null };
    const user = await userModel.findById(userId).select("-password").lean();
    return { user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error("Error in getme:", error);
    return { user: null };
  }
};
