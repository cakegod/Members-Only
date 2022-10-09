import express, { Request, Response } from 'express';
import path from 'path';
import createHttpError from 'http-errors';
import logger from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import indexRouter from '@routes/index';
import CHttpException from './types';
import { Strategy } from 'passport-local';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcryptjs';

// Init dotenv
config();

// Database connection
const mongoDB = process.env.MONGO_URI!;
mongoose.connect(mongoDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as mongoose.ConnectOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// init express
const app = express();

// sets basic express settings
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine and statics primer
app.use(express.static(path.join(__dirname, '../', 'public')));
app.set('views', path.join(__dirname, '../', 'views'));
app.set('view engine', 'pug');

// logger
if (app.get('env') === 'development') {
	app.use(logger('dev'));
}

// security
if (app.get('env') === 'production') {
	app.use(helmet());
}

// adds base routing
app.use('/', indexRouter);

// catch 404 and fwd
app.use((req, res, next) => {
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

// Passport
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
	new Strategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username' });
			}
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Incorrect password' });
				}
			});
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

export default app;
