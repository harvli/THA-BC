import express from 'express';
import dbController from './dbController.js';
import path from 'path';

const dbRouter = express.Router();

// Routes for DB transactions

dbRouter.get('/q1_shifts', dbController.getShifts, (req, res) => {
	return res.status(200).json(res.locals.data);
});

dbRouter.post('/overlapThreshold', dbController.overlap, (req, res) => {
	return res.status(200).json(res.locals.overlap);
});

export default dbRouter;
