import express from 'express';
import dbController from './dbController.js';
import path from 'path';

const dbRouter = express.Router();
dbRouter.use(express.json());

dbRouter.get('/q1_shifts', dbController.getShifts, (req, res) => {
	return res.status(200).json();
});

export default dbRouter;