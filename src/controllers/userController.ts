import async from 'async';
import { Request, Response, NextFunction } from 'express';
import { body, check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { User } from '../models/User';
import { CallbackError } from 'mongoose';

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
		check('username', 'Username must not be empty')
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
					return next(err);
				}
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
				});

				user.save(_err => {
					if (_err) {
						return next(_err);
					}

					res.redirect('/');
				});
			});
		},
	],
	getLogout: (req: Request, res: Response, next: NextFunction) => {
		req.logout(err => {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	},

	getClubJoin: (req: Request, res: Response) => {
		res.render('club-join');
	},
	postClubJoin: [
		check('secret-code', 'Secret code must not be empty')
			.trim()
			.escape()
			.custom((value, { req }) => value === 'cake')
			.withMessage('False code!'),
		(req: Request, res: Response, next: NextFunction) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.render('club-join', {
					title: 'Login',
					errors: errors.array(),
				});
				return;
			}

			const user = new User({
				...req.user,
				_id: req.user.id,
				membership: 'member',
			});

			console.log(req.user);

			User.findByIdAndUpdate(req.user.id, user, {}, err => {
				if (err) {
					return next(err);
				}
				res.redirect('/');
			});
		},
	],
};

export default userController;
