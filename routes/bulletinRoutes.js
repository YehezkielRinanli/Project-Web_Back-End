import express from 'express';
import { getBulletins, createBulletin, updateBulletin, deleteBulletin } from '../controllers/bulletinController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getBulletins);

router.post('/', verifyToken, verifyAdmin, createBulletin);
router.put('/:id', verifyToken, verifyAdmin, updateBulletin);
router.delete('/:id', verifyToken, verifyAdmin, deleteBulletin);

export default router;