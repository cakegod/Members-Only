import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

router.get('/', (req, res) => res.render('index'));

router
	.route('/login')
	.get(userController.getLogin)
	.post(userController.postLogin);
	
router
	.route('/signup')
	.get(userController.getSignup)
	.post(userController.postSignup);

export default router;
