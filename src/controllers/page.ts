import { Request, Response } from "express";

const something = (req: Request, res: Response) => {
	res.send("E.");
};

export { something };
