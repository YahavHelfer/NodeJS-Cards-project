import { Router } from "express";
import Card from "../models/cards.schema.js";
import { auth } from "../../middlewares/token.js";
import { isUser } from "../../middlewares/isUser.js";
import { addCard, Likes, updateCard } from "../services/cardDataAccess.service.js";
import { isBuissines } from "../../middlewares/isBuissines.js";
import CardSchema from "../validations/CardSchema.js";
import { validation } from "../../middlewares/validation.js";
import { deleteCard } from "../services/cardDataAccess.service.js";





const router = Router();

router.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        return res.json(cards);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    console.log("🔍 Checking user ID:", req.user.id);

    const cards = await Card.find({ userId: req.user.id });

    console.log("🃏 Found cards:", cards);

    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: "No cards found for this user." });
    }

    return res.json(cards);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



router.get("/:id", async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        return res.json(card);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.post("/", auth, isBuissines, validation(CardSchema), async (req, res) => {
  try {
    console.log("🔍 Checking user in POST /cards:", req.user); // בדיקה חשובה

    const data = req.body;
    const userId = req.user.id; // 🛠️ שים לב! היה _id, שיניתי ל-id

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID is missing." });
    }

    const newCard = await addCard(data, userId);

    return res.status(201).json({ message: "Card Created", newCard });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


router.patch("/:id", auth, isUser, async (req, res) => {
  try {
    // קבלת ה-ID של הכרטיס מתוך ה- params
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // קבלת ה-ID של המשתמש מתוך ה-token (auth middleware אמור להוסיף אותו)
    const userId = req.user._id;

    // בדיקה אם המשתמש כבר עשה לייק
    const likeIndex = card.likes.indexOf(userId);

    if (likeIndex === -1) {
      // אם המשתמש לא עשה לייק – נוסיף אותו
      card.likes.push(userId);
    } else {
      // אם המשתמש כבר עשה לייק – נסיר אותו (Unlike)
      card.likes.splice(likeIndex, 1);
    }

    // שמירת העדכון במסד הנתונים
    await card.save();

    return res.json(card);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});




router.delete("/:id", auth, isUser, async (req, res) => {
  try {
    const card = await deleteCard(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    return res.json({ message: "Card deleted successfully", deletedCard: card });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

export default router;
