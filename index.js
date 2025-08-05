const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Admin SDK setup
try {
  const serviceAccount = require("./firebase-key.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin initialized");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

const db = admin.firestore();

// Health check route for Render
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// Example: Get all users from Firestore
app.get("/users", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const users = [];

    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error getting users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Dynamic port for Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
