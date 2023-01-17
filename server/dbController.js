import db from './db.js';

// Controller to handle middleware functionality

const dbController = {};

dbController.getShifts = (req, res, next) => {
	const text =
		'SELECT * FROM "question_one_shifts" INNER JOIN "facilities" ON question_one_shifts.facility_id = facilities.facility_id';
	db.query(text)
		.then((data) => {
			console.log(data.rows);
			res.locals.data = data.rows;
			next();
		})
		.catch((err) => next(err));
};

dbController.overlap = async (req, res, next) => {
	try {
		const shiftA = req.body.SHIFT_A;
		const shiftB = req.body.SHIFT_B;
		let maxOverlap;
		if (shiftA.facility_id == shiftB.facility_id) maxOverlap = 30;
		else maxOverlap = 0;
		let overlapMins;
		if (shiftB.start_time.slice(0, 2) === shiftA.end_time.slice(0, 2)) {
			overlapMins = Math.abs(shiftA.end_time.slice(3, 5) - shiftB.start_time.slice(3, 5));
		}
		let exceedsOverlap = overlapMins > maxOverlap;
    res.locals.overlap = {shiftA, shiftB, overlapMins, maxOverlap, exceedsOverlap};
    console.log(res.locals.overlap)
		next();
	} catch (err) {
		next(err);
	}
};

export default dbController;
