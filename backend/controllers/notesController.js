import { Op } from "sequelize"; 
import Note from "../models/Note.js"; 

export const getAllNotes = async (req, res, next) => {
  try {
    const status = req.query.status;
    const search = req.query.search;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    
    let condition = { userId: req.user.id }; 

    if (status && status !== 'all') {
      condition.status = status;
    }

    if (search) {
      condition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const data = await Note.findAndCountAll({ 
        where: condition,
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
    });

    res.status(200).json({ 
        success: true, 
        message: "Catatan berhasil diambil", 
        data: data.rows,
        pagination: {
            totalItems: data.count,
            totalPages: Math.ceil(data.count / limit),
            currentPage: page
        }
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Note.findOne({ where: { id: id, userId: req.user.id }});

    if (!data) return res.status(404).json({ success: false, message: `Catatan tidak ditemukan atau bukan milik Anda` });

    res.status(200).json({ success: true, message: "Catatan berhasil diambil", data: data });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const noteData = { ...req.body, userId: req.user.id };
    
    if (req.file) {
        noteData.lampiran = req.file.path.replace(/\\/g, "/"); // Normalisasi path untuk Windows
    }

    const newNote = await Note.create(noteData); 
    res.status(201).json({ success: true, message: "Catatan berhasil disimpan", data: newNote });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
        updateData.lampiran = req.file.path.replace(/\\/g, "/");
    }
    
    const updated = await Note.update(updateData, {
        where: { id: id, userId: req.user.id }
    });

    if (updated[0] === 0) return res.status(404).json({ success: false, message: "Catatan tidak ditemukan" });
    res.status(200).json({ success: true, message: "Catatan berhasil diupdate" });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Note.destroy({ where: { id: id, userId: req.user.id } });

    if (!deleted) return res.status(404).json({ success: false, message: "Catatan tidak ditemukan atau bukan milik Anda" });

    res.status(200).json({ success: true, message: `Catatan berhasil dihapus permanen` });
  } catch (error) {
    next(error);
  }
};