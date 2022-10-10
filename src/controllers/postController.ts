import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { Post } from '../models/Post';

const postController = {
	getMessages: (req: Request, res: Response, next: NextFunction) => {
		Post.find({})
			.sort({ date: 1 })
			.populate('author', 'username')
			.exec((err, messages) => {
				if (err) {
					return next(err);
				}
				res.render('index', { messages });
			});
	},

	postDeleteMessage: (req: Request, res: Response, next: NextFunction) => {
		Post.findByIdAndDelete(req.body.id).exec(err => {
			if (err) {
				return next(err);
			}
			Post.find({})
				.sort({ date: 1 })
				.populate('author', 'username')
				.exec((_err, messages) => {
					if (_err) {
						return next(_err);
					}
					res.render('index', { messages });
				});
		});
	},

	getMessageForm: (req: Request, res: Response, next: NextFunction) => {
		res.render('messageForm');
	},

	postMessageForm: [
		check('title', 'Title must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check('description', 'Title must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		// check('author', 'Author must not be empty')
		// 	.not()
		// 	.isEmpty()
		// 	.trim()
		// 	.escape(),
		// check('date', 'Date must not be empty').not().isEmpty().trim().escape(),
		(req: Request, res: Response, next: NextFunction) => {
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
				date: Date.now(),
			});

			post.save(err => {
				if (err) {
					return next(err);
				}
			});

			res.redirect('/');
		},
	],
};

export default postController;
