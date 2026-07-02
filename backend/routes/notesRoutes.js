import express from "express";
import { 
    getAllNotes, 
    getNoteById, 
    createNote, 
    updateNote, 
    deleteNote
 } from "../controllers/notesController.js"; 
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", verifyToken, upload.single("lampiran"), createNote);
router.put("/:id", upload.single("lampiran"), updateNote);
router.delete("/:id", deleteNote);

export default router;