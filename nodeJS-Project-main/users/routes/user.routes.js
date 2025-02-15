import { Router } from "express";
import User from "../models/User.schema.js"
import {
  addUser,
  deleteUser,
  updateUser,
  login,
  getUserById,
} from "../services/userDataAccess.service.js";
import { validation } from "../../middlewares/validation.js";
import LoginSchema from "../validations/LoginSchema.js";
import RegisterSchema from "../validations/RegisterSchema.js";
import { generateToken } from "../../services/authService.js";
import { auth } from "../../middlewares/token.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
import { isUser } from "../../middlewares/isUser.js";
import { changeAuthLevel } from "../services/userDataAccess.service.js";
const router = Router();


router.post("/register", validation(RegisterSchema), async (req, res) => {
  try {
    const data = req.body;

    // בדיקת אימייל קיים
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({ message: "The email already exists in the system." });
    }

    // יצירת משתמש חדש
    const newUser = await addUser(data);

    return res.status(201).json({ message: "User Created", user: newUser });

  } catch (err) {
    console.error("🔥 Error in /register:", err.message);
    return res.status(500).json({ error: "Internal Server Error" }); // במקום להחזיר שגיאה גולמית
  }
});





router.post("/login", validation(LoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const tryLogin = await login(email, password);
    if (!tryLogin) {
      return res.status(404).send("User not found!");
    }
    const user = await User.findOne({ email });
    const token = generateToken(user);
    return res.send(token);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await getUserById(id);

    return res.status(200).json(user);

  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/:id", auth, isUser, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedUser = await updateUser(id, data);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser); // מחזיר את כל הנתונים של המשתמש לאחר עדכון
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", auth, isUser, async (req, res) => {
  try {
    const { id } = req.params; // לוקחים את ה-ID מהכתובת
    const updatedUser = await changeAuthLevel(id);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth, isUser, async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully", user });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



export default router;