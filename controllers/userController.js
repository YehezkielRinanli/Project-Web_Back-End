import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'collab_edit_count', 'createdAt']
        });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan saat mengambil data user." 
        });
    }
};

export const resetCollabLimit = async (req, res) => {
    try {
        const targetUserId = req.params.id;

        const user = await User.findByPk(targetUserId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan." });
        }

        user.collab_edit_count = 0;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Limit edit kolaborasi untuk user ${user.email} berhasil di-reset menjadi 0.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal me-reset limit user." });
    }
};