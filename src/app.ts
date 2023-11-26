import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import createHttpError from 'http-errors';
import logger from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import indexRouter from './routes/index';
import { User } from './models/User';
import CHttpException from './types';
import MongoStore from 'connect-mongo';

dotenv.config();

mongoose.connect(process.env.MONGO_URI!);
mongoose.connection.on(
	'error',
	console.error.bind(console, 'MongoDB connection error:')
);

const app = express();

// Passport
passport.use(
	new LocalStrategy(async (username, password, done) => {
		const user = await User.findOne({ username });
		if (!user) {
			return done(null, false, { message: 'Incorrect username' });
		}

		if (bcrypt.compareSync(user.password, password)) {
			done(null, false, { message: 'Incorrect password' });
		} else {
			done(null, user);
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});

app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({ client: mongoose.connection.getClient() })
	})
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// sets basic express settings
app.use(express.json());

// logger
if (app.get('env') === 'development') {
	app.use(logger('dev'));
}

// security
if (app.get('env') === 'production') {
	app.use(helmet());
}

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// view engine and statics primer
app.use(express.static(path.join(__dirname, '../', 'public')));
app.set('views', path.join(__dirname, '../', 'views'));
app.set('view engine', 'pug');

// adds base routing
app.use('/', indexRouter);

// catch 404 and fwd
app.use((_req: Request, _res: Response, next: NextFunction) => {
	next(createHttpError(404));
});

// error handler
app.use((err: CHttpException, req: Request, res: Response) => {
	if (req.app.get('env') === 'development') {
		res.locals.error = err;
	} else res.locals.error = {};
	res.locals.message = res.locals.error;

	// render error page
	res.status(err.status || 500);
	res.render('error');
});

export default app;
