export const isBuissines = (req, res, next) => {
  console.log("🔍 Checking user in isBuissines middleware:", req.user); // בדיקה לוגית

  if (!req.user || !req.user.isBusiness) { // ודא שהשדה נקרא "isBusiness"
    return res.status(403).json({ message: "You are not a business user." });
  }

  next(); // ✅ אין צורך ב-return
};

