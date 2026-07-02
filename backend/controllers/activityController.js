import Activity from "../models/Activity.js";

export const createActivity = async (req, res, next) => {
    try {
        const activityData = { ...req.body, userId: req.user.id };
        const newActivity = await Activity.create(activityData);
        res.status(201).json({ success: true, message: "Aktivitas dicatat", data: newActivity });
    } catch (error) {
        next(error);
    }
};

export const getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.findAll({ 
            where: { userId: req.user.id }, 
            order: [['createdAt', 'DESC']] 
        });
        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        next(error);
    }
};

export const deleteActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const deleted = await Activity.destroy({ 
            where: { 
                id: id, 
                userId: req.user.id
            } 
        });

        if (!deleted) return res.status(404).json({ success: false, message: "Aktivitas tidak ditemukan" });
        res.status(200).json({ success: true, message: "Aktivitas berhasil dihapus" });
    } catch (error) {
        next(error);
    }
};