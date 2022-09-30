import express from "express";
import { pageRouter } from "@routes/page-router";

const indexRouter = () => {
	const router = express.Router();
	router.use("/a-page", pageRouter());
	return router;
};

export { indexRouter };
