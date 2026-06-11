import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Bulletin = db.define('Bulletin', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'bulletins',
    timestamps: true
});

export default Bulletin;