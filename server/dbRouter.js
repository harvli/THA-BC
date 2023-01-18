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

dbRouter.get('/q4', dbController.q4, (req, res) => {
	return res.status(200).json(res.locals.q4);
});

dbRouter.get('/q5', dbController.q5, (req, res) => {
	return res.status(200).json(res.locals.q5);
});

dbRouter.get('/q6', dbController.q6, (req, res) => {
	return res.status(200).json(res.locals.q6);
});

export default dbRouter;
