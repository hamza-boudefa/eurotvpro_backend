const express = require("express");
const { Apps } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// 🔸 Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Max File Size
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .png, .jpg, and .jpeg formats allowed!"), false);
    }
    cb(null, true);
  },
});

// 🔸 Create a New App with Image Upload
router.post("/addApp", upload.single("image"), async (req, res) => {
  try {
    const { name, price, promo } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Name and price are required" });
    if (price < 0) return res.status(400).json({ error: "Price cannot be negative" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newApp = await Apps.create({ name, price, promo: promo || null, image: imagePath });
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ error: "Failed to create app", details: error.message });
  }
});

// 🔸 Update an App (Change Data and Replace Image if New One is Provided)
router.put("/updateApp/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, promo } = req.body;
    const app = await Apps.findByPk(req.params.id);

    if (!app) return res.status(404).json({ error: "App not found" });
    if (price < 0) return res.status(400).json({ error: "Price cannot be negative" });

    let imagePath = app.image; // Keep existing image if no new image uploaded
    if (req.file) {
      // Delete old image file if it exists
      if (app.image) {
        const oldImagePath = path.join(__dirname, "..", app.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    await app.update({ name, price, promo: promo || null, image: imagePath });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: "Error updating app", details: error.message });
  }
});

// 🔸 Delete an App (Remove from DB & Delete Image File)
router.delete("/delete/:id", async (req, res) => {
  try {
    const app = await Apps.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: "App not found" });

    // Delete image file if it exists
    if (app.image) {
      const imagePath = path.join(__dirname, "..", app.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await app.destroy();
    res.json({ message: "App deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting app", details: error.message });
  }
});

// 🔸 Get All Apps
router.get("/getAllApps", async (req, res) => {
  try {
    const apps = await Apps.findAll();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: "Error fetching apps" });
  }
});

// 🔸 Get Single App by ID
router.get("/getApp/:id", async (req, res) => {
  try {
    const app = await Apps.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: "App not found" });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: "Error fetching app" });
  }
});

// 🔸 Serve Uploaded Images as Static Files
router.use("/uploads", express.static("uploads"));

module.exports = router;
