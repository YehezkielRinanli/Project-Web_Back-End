import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import noteRoutes from './routes/notesRoutes.js'; // Aulia
import folderRoutes from './routes/folderRoutes.js'; // Fadil
import collaborationRoutes from "./routes/collaborationRoutes.js"; // Kasih
import userRoutes from './routes/userRoutes.js'; // Yehezkiel
import tagRoutes from './routes/tagRoutes.js'; // Aulia
import activityRoutes from './routes/activityRoutes.js'; // Aulia
import bulletinRoutes from './routes/bulletinRoutes.js'; // Aulia

import db from "./config/database.js";
import User from "./models/User.js"; 
import Note from "./models/Note.js"; 
import Folder from "./models/Folder.js"; 
import Tag from "./models/Tag.js"; 
import Activity from "./models/Activity.js";
import Bulletin from "./models/Bulletin.js";

import { verifyToken } from "./middleware/auth.js";

const app = express();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Folder, { foreignKey: 'userId', as: 'folders' });
Folder.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Folder.hasMany(Note, { foreignKey: 'folderId', as: 'folderNotes' }); 
Note.belongsTo(Folder, { foreignKey: 'folderId', as: 'folder' });

User.hasMany(Tag, { foreignKey: 'userId', as: 'tags' });
Tag.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Bulletin, { foreignKey: 'author_id', as: 'bulletins' });
Bulletin.belongsTo(User, { foreignKey: 'author_id', as: 'author' });


app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes); // Yehezkiel

app.use('/api/notes', verifyToken, noteRoutes); // Aulia
app.use('/api/folders', verifyToken, folderRoutes); // Fadil
app.use("/api/collabs", verifyToken, collaborationRoutes); // Kasih
app.use('/api/tags', verifyToken, tagRoutes); // Aulia 
app.use('/api/activities', verifyToken, activityRoutes); // Aulia 
app.use('/api/bulletins', verifyToken, bulletinRoutes); // Aulia

app.get("/", (req, res) => {
    const index = join(__dirname, "public", "index.html");
    res.sendFile(index);
});

app.get('/api/status', (req, res) => {
    res.json({ message: "Server API Memoora berjalan dengan baik!" });
});

db.sync({ alter: true })
    .then(() => {
        console.log("Database MySQL berhasil disinkronkan!");
        app.listen(3000, () => {
            console.log("Server Memoora berjalan di http://localhost:3000");
        });
    })
    .catch((error) => {
        console.error("Gagal sinkronisasi database:", error);
    });