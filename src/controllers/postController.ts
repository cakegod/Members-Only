import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Post } from '../models/Post';
import { User } from '../models/User';

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
};

export default postController;
