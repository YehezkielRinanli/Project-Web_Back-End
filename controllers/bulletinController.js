import Bulletin from '../models/Bulletin.js';
import User from '../models/User.js';

// GET /api/bulletins
// Mendukung query string ?limit=N untuk mengambil N buletin terbaru saja
// (dipakai oleh widget "Pengumuman Terbaru" di Dashboard User)
export const getBulletins = async (req, res) => {
    try {
        const { limit } = req.query;

        const options = {
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] }
            ]
        };

        if (limit) options.limit = parseInt(limit, 10);

        const bulletins = await Bulletin.findAll(options);
        res.status(200).json({ success: true, data: bulletins });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil data buletin." });
    }
};

// GET /api/bulletins/:id
export const getBulletinById = async (req, res) => {
    try {
        const { id } = req.params;

        const bulletin = await Bulletin.findByPk(id, {
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] }
            ]
        });

        if (!bulletin) return res.status(404).json({ success: false, message: "Buletin tidak ditemukan." });

        res.status(200).json({ success: true, data: bulletin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil data buletin." });
    }
};

// POST /api/bulletins (Admin)
export const createBulletin = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Judul dan isi buletin wajib diisi." });
        }

        const newBulletin = await Bulletin.create({
            title,
            content,
            author_id: req.user.id
        });

        const bulletinWithAuthor = await Bulletin.findByPk(newBulletin.id, {
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
        });

        res.status(201).json({ success: true, message: "Buletin berhasil diterbitkan!", data: bulletinWithAuthor });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal membuat buletin." });
    }
};

// PUT /api/bulletins/:id (Admin)
export const updateBulletin = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Judul dan isi buletin wajib diisi." });
        }

        const bulletin = await Bulletin.findByPk(id);
        if (!bulletin) return res.status(404).json({ success: false, message: "Buletin tidak ditemukan." });

        await bulletin.update({ title, content });
        res.status(200).json({ success: true, message: "Buletin berhasil diperbarui!", data: bulletin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal memperbarui buletin." });
    }
};

// DELETE /api/bulletins/:id (Admin)
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