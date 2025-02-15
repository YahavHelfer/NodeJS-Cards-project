import { isBuissines } from "../../middlewares/isBuissines.js";
import User from "../models/User.schema.js";
import { hashPassword, comparePassword } from "./password.service.js";
import mongoose from "mongoose";



import lodash from "lodash";
const { pick } = lodash;

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    } else {
      return "Login successful";
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getUserById = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return pick(user.toObject(), [
      "name",
      "address",
      "image",
      "_id",
      "isBusiness",
      "isAdmin",
      "phone",
      "email",
    ]);

  } catch (err) {
    throw new Error(err.message);
  }
};


const deleteUser = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateUser = async (userId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    // אם המשתמש מעדכן סיסמה – נצפין אותה לפני השמירה
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // משיגים את המשתמש הנוכחי כדי לוודא שלא מוחקים מידע קיים
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // יוצרים אובייקט מעודכן שמכיל את כל הנתונים הישנים + החדשים
    const updatedData = {
      ...existingUser.toObject(), // משמר את הנתונים הישנים
      ...data, // מעדכן רק את הנתונים החדשים שנשלחו
    };

    // מבצעים עדכון במסד הנתונים
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("User not found after update");
    }

    // 🛠️ מחזירים את הנתונים של המשתמש ללא הסיסמה
    return pick(updatedUser.toObject(), [
      "_id",
      "name",
      "email",
      "phone",
      "image",
      "address",
      "isAdmin",
      "isBusiness",
      "createdAt"
    ]);

  } catch (err) {
    throw new Error(err.message);
  }
};


const addUser = async (userData) => {
  try {
    const usedEmail = await User.findOne({ email: userData.email });
    if (usedEmail) {
      throw new Error("❌ Email already in use");
    }

    const hashedPassword = await hashPassword(userData.password);

    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });

    await newUser.save();

    return pick(newUser.toObject(), [
      "name",
      "address",
      "image",
      "_id",
      "isBusiness",
      "isAdmin",
      "phone",
      "email",
    ]);

  } catch (error) {
    console.error("🔥 Error adding user:", error.message);
    throw error;
  }
};


const changeAuthLevel = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // שינוי הערך של isBusiness
    user.isBusiness = !user.isBusiness;

    // שמירה במסד הנתונים
    await user.save();

    return user;
  } catch (err) {
    throw new Error(err.message); // תיקון massage -> message
  }
};
export { getUserById, deleteUser, updateUser, addUser, login, changeAuthLevel };

