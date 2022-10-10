import express from 'express';
import postController from '../controllers/postController';
import userController from '../controllers/userController';

const router = express.Router();

router
	.route('/')
	.get(postController.getMessages)
	.post(postController.postDeleteMessage);

router
	.route('/message')
	.get(postController.getMessageForm)
	.post(postController.postMessageForm);

router
	.route('/login')
	.get(userController.getLogin)
	.post(userController.postLogin);

router
	.route('/signup')
	.get(userController.getSignup)
	.post(userController.postSignup);

router
	.route('/club-join')
	.get(userController.getClubJoin)
	.post(userController.postClubJoin);

router.get('/logout', userController.getLogout);

export default router;
