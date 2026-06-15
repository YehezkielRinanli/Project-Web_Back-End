import Bulletin from '../models/Bulletin.js';

export const getBulletins = async (req, res) => {
    try {
        const bulletins = await Bulletin.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: bulletins });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil data buletin." });
    }
};

export const createBulletin = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBulletin = await Bulletin.create({ title, content });
        res.status(201).json({ success: true, message: "Buletin berhasil diterbitkan!", data: newBulletin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal membuat buletin." });
    }
};

export const updateBulletin = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        const bulletin = await Bulletin.findByPk(id);
        if (!bulletin) return res.status(404).json({ success: false, message: "Buletin tidak ditemukan." });

        await bulletin.update({ title, content });
        res.status(200).json({ success: true, message: "Buletin berhasil diperbarui!", data: bulletin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal memperbarui buletin." });
    }
};

export const deleteBulletin = async (req, res) => {
    try {
        const { id } = req.params;
        const bulletin = await Bulletin.findByPk(id);
        if (!bulletin) return res.status(404).json({ success: false, message: "Buletin tidak ditemukan." });

        await bulletin.destroy();
        res.status(200).json({ success: true, message: "Buletin berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal menghapus buletin." });
    }
};