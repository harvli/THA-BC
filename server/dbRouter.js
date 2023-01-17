import express from 'express';
import dbController from './dbController';
import path from 'path';

const router = express.Router();
router.use(express.json());

router.get('/q1_shifts', dbController.getShifts, (req, res) => {
  return res.status(200).json()
})

export default router;