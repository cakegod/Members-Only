import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { Post } from '../models/Post';

async function getMessages(_req: Request, res: Response) {
	const messages = await Post.find({})
		.sort({ date: 1 })
		.populate('author', 'username');

	res.render('index', { messages });
}

async function postDeleteMessage(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	await Post.findByIdAndDelete(req.body.id);
	next();
}

async function getMessageForm(_req: Request, res: Response) {
	res.render('messageForm');
}

const validateMessageForm = [
	check('title', 'Title must not be empty').not().isEmpty().trim().escape(),
	check('description', 'Title must not be empty')
		.not()
		.isEmpty()
		.trim()
		.escape(),
];

async function postMessageForm(req: Request, res: Response) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render('messageForm', {
			title: req.body.title,
			description: req.body.description,
			errors: errors.array(),
		});
		return;
	}
	const post = new Post({
		title: req.body.title,
		description: req.body.description,
		author: req.user.id,
	});

	console.log(post);

	await post.save();

	res.redirect('/');
}

export default {
	getMessages,
	postDeleteMessage: [postDeleteMessage, getMessages],
	getMessageForm,
	postMessageForm: [...validateMessageForm, postMessageForm],
};
