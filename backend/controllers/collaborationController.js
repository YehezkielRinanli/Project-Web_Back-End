import Collaboration from "../models/Collaboration.js";
import User from "../models/User.js";

export const addCollaborator = async (req, res, next) => {
    try {
        const { email, role } = req.body;

        const targetUser = await User.findOne({ where: { email: email } });
        
        if (!targetUser) {
            return res.status(404).json({ 
                success: false, 
                message: "Email tidak ditemukan. Pastikan temanmu sudah daftar Memoora!" 
            });
        }

        const existingCollab = await Collaboration.findOne({ where: { email: email } });
        
        if (existingCollab) {
            return res.status(400).json({ 
                success: false, 
                message: "Email ini sudah ada di daftar kolaborator." 
            });
        }

        const newCollab = await Collaboration.create({ email, role });
        
        res.status(201).json({ success: true, data: newCollab });
    } catch (error) {
        next(error);
    }
};

export const getCollaborators = async (req, res, next) => {
    try {
        const collabs = await Collaboration.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({ success: true, data: collabs });
    } catch (error) {
        next(error);
    }
};

export const removeCollaborator = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Collaboration.destroy({ where: { id } });
        res.status(200).json({ success: true, message: "Collaborator removed" });
    } catch (error) {
        next(error);
    }
};

export const updateCollab = async (req, res, next) => {
    try {
        const collabId = req.params.id;
        const { role } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let editCount = user.collab_edit_count;
        if (user.last_collab_edit_date) {
            const lastEditDate = new Date(user.last_collab_edit_date);
            if (lastEditDate.getMonth() !== currentMonth || lastEditDate.getFullYear() !== currentYear) {
                editCount = 0;
            }
        }

        if (editCount >= 3) {
            return res.status(403).json({
                success: false,
                message: "Limit edit kolaborasi Anda (3x bulan ini) sudah habis. Silakan hubungi Admin."
            });
        }

        const collab = await Collaboration.findByPk(collabId);
        if (!collab) {
            return res.status(404).json({ success: false, message: "Data kolaborator tidak ditemukan." });
        }

        collab.role = role;
        await collab.save();

        user.collab_edit_count = editCount + 1;
        user.last_collab_edit_date = now;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Role berhasil diperbarui! Sisa kuota edit bulan ini: ${3 - user.collab_edit_count}x`
        });

    } catch (error) {
        next(error);
    }
};