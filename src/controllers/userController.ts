import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { User } from '../models/User';

async function getLogin(req: Request, res: Response) {
	res.render('login', { user: req.user });
}

const postLogin = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
});

async function getSignup(_req: Request, res: Response) {
	res.render('signup');
}

const validatePostSignup = [
	check('username', 'Username must not be empty')
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check('password').exists(),
	check(
		'password_confirm',
		'Both password and confirm password must be equal',
	)
		.exists()
		.custom((value, { req }) => value === req.body.password),
];

async function postSignup(req: Request, res: Response) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render('signup', {
			errors: errors.array(),
		});
		return;
	}

	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	await new User({
		username: req.body.username,
		password: hashedPassword,
	}).save();

	res.redirect('/');
}

async function getLogout(req: Request, res: Response, next: NextFunction) {
	req.logout(err => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
}

async function getClubJoin(_req: Request, res: Response) {
	res.render('club-join');
}

const validateSecretCode = [
	check('secret-code', 'Secret code must not be empty')
		.trim()
		.escape()
		.custom(value => value === 'cake')
		.withMessage('False code!'),
];

async function postClubJoin(req: Request, res: Response) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render('club-join', {
			title: 'Login',
			errors: errors.array(),
		});
		return;
	}

	await User.findByIdAndUpdate(req.user.id, { membership: 'member' });
	res.redirect('/');
}

export default {
	getLogin,
	postLogin,
	getSignup,
	postSignup: [...validatePostSignup, postSignup],
	getLogout,
	getClubJoin,
	postClubJoin: [...validateSecretCode, postClubJoin],
};
