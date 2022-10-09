import async from 'async';
import { Request, Response, NextFunction } from 'express';
import { body, check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { User } from '../models/User';

const userController = {
	getLogin: (req: Request, res: Response) => {
		res.render('login', { user: req.user });
	},
	postLogin: passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
	}),

	getSignup: (req: Request, res: Response) => {
		res.render('signup');
	},
	postSignup: [
		body('username', 'Username must not be empty')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check('password').exists(),
		check(
			'password_confirm',
			'Both password and confirm password must be equal'
		)
			.exists()
			.custom((value, { req }) => value === req.body.password),
		(req: Request, res: Response, next: NextFunction) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.render('signup', {
					title: 'Login',
					errors: errors.array(),
				});
				return;
			}

			bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
				if (err) {
					next(err);
					return;
				}
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
				});

				user.save(_err => {
					if (_err) {
						next(_err);
						return;
					}
					console.log('test');
					res.redirect('/');
				});
			});
		},
	],
};

export default userController;
