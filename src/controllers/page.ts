import async from 'async';
import { Request, Response, nextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const controller = (req: Request, res: Response, next: nextFunction) => {
	res.send('E.');
};

export default controller;
