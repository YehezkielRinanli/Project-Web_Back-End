import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Note = db.define('Note', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    dueDate: { type: DataTypes.DATEONLY },
    tag: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    folderId: {
        type: DataTypes.INTEGER,
        allowNull: true 
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false 
    }
}, {
    tableName: 'notes',
    timestamps: true
});

export default Note;