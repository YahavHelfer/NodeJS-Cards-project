import Card from "../models/cards.schema.js";
import lodash from "lodash";



const { pick } = lodash; 

const addCard = async (cardData, userId) => {
  if (!userId) {
    throw new Error("User ID is required to create a card."); // שגיאה מתאימה
  }

  console.log("🛠️ Creating card for userId:", userId); // בדיקה בקונסולה

  const newCard = new Card({ ...cardData, userId }); // 🛠️ הוספת userId לכרטיס
  await newCard.save();

  const returnCard = pick(newCard.toObject(), [
    "title",
    "subtitle",
    "description",
    "phone",
    "email",
    "web",
    "image",
    "address",
    "_id",
    "bizNumber",
    "userId"
  ]);

  return returnCard;
};

const updateCard = async (cardId) => {
  try {
    const card = await Card.findByIdAndUpdate(cardId);
    if (!user) {
      throw new Error("User not found");
    }
    return card;
  } catch (err) {
    throw new Error(err.massage);
  }
};

const deleteCard = async (cardId) => {
  try {
    const card = await Card.findByIdAndDelete(cardId);
    return card; // מחזיר את הכרטיס שנמחק או null אם לא נמצא
  } catch (err) {
    throw new Error(err.message); // תיקון err.massage -> err.message
  }
};


const Likes = async (userId) => {
  try {
    const card = await Card.Likes.push(userId);
    card.save();
  }catch{
    throw new Error(err.massage);
  }
};


export { updateCard, addCard, deleteCard, Likes };