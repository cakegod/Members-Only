import express from 'express';
import { something } from '@controllers/page';

const pageRouter = () => {
	const router = express.Router();
	router.use('/', something);
	return router;
};

export { pageRouter };
