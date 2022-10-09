import express from 'express';
import { pageRouter } from '@routes/page-router';

const router = express.Router();

router.route('/').get('controller...');

export default router;
