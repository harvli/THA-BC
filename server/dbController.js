import db from './db.js';

// Controller to handle middleware functionality

const dbController = {};

dbController.getShifts = (req, res, next) => {
	const text =
		'SELECT * FROM "question_one_shifts" INNER JOIN "facilities" ON question_one_shifts.facility_id = facilities.facility_id';
	db.query(text)
		.then((data) => {
			res.locals.data = data.rows;
			next();
		})
		.catch((err) => next(err));
};

dbController.overlap = async (req, res, next) => {
	try {
		console.log('req', req.body);
		const { SHIFT_A, SHIFT_B } = req.body;
		let maxOverlap;
		if (SHIFT_A.facility_id == SHIFT_B.facility_id) maxOverlap = 30;
		else maxOverlap = 0;
		let overlapMins = 0;

		let shiftA_startTime =
			parseInt(SHIFT_A.start_time.slice(0, 2)) + parseInt(SHIFT_A.start_time.slice(3, 5)) / 60;

		let shiftA_endTime =
			parseInt(SHIFT_A.end_time.slice(0, 2)) + parseInt(SHIFT_A.end_time.slice(3, 5)) / 60;
		let shiftB_startTime =
			parseInt(SHIFT_B.start_time.slice(0, 2)) + parseInt(SHIFT_B.start_time.slice(3, 5)) / 60;
		let shiftB_endTime =
			parseInt(SHIFT_B.end_time.slice(0, 2)) + parseInt(SHIFT_B.end_time.slice(3, 5)) / 60;
		console.log('hi');
		console.log('boo', shiftA_startTime, shiftA_endTime, shiftB_startTime, shiftB_endTime);
		console.log(SHIFT_A.shift_date.slice(8, 10));
		// overlap for overnight shifts edge case
		if (
			shiftA_startTime > shiftA_endTime &&
			parseInt(SHIFT_A.shift_date.slice(8, 10)) + 1 === parseInt(SHIFT_B.shift_date.slice(8, 10))
		) {
			if (shiftB_startTime > shiftA_endTime) overlapMins = 0;
			else overlapMins = (shiftA_endTime - shiftB_startTime) * 60;
		} else if (
			// if A and B were swapped
			shiftB_startTime > shiftB_endTime &&
			parseInt(SHIFT_B.shift_date.slice(8, 10)) + 1 === parseInt(SHIFT_A.shift_date.slice(8, 10))
		) {
			if (shiftA_startTime > shiftB_endTime) overlapMins = 0;
			else overlapMins = (shiftB_endTime - shiftA_startTime) * 60;
		} else if (SHIFT_A.shift_date.slice(8, 10) === SHIFT_B.shift_date.slice(8, 10)) {
			if (
				// if same hour
				SHIFT_B.start_time.slice(0, 2) === SHIFT_A.end_time.slice(0, 2) ||
				SHIFT_A.start_time.slice(0, 2) === SHIFT_B.end_time.slice(0, 2)
			) {
				overlapMins = Math.max(
					Math.abs(
						parseInt(SHIFT_A.end_time.slice(3, 5)) - parseInt(SHIFT_B.start_time.slice(3, 5))
					),
					Math.abs(
						parseInt(SHIFT_A.start_time.slice(3, 5)) - parseInt(SHIFT_B.end_time.slice(3, 5))
					)
				);
			} else if (
				shiftB_startTime < shiftA_endTime &&
				shiftB_startTime > shiftA_startTime &&
				shiftB_endTime > shiftA_endTime
			) {
				// if overlap is larger than an hour
				overlapMins = (shiftA_endTime - shiftB_startTime) * 60;
			} else if (
				shiftA_startTime < shiftB_endTime &&
				shiftA_startTime > shiftB_startTime &&
				shiftA_endTime > shiftB_endTime
			) {
				// other selected order for if overlap is larger than an hour
				overlapMins = (shiftB_endTime - shiftA_startTime) * 60;
			}
		}
		// Harvey's Dev Notes: Overall logic is sound, calculates overlap minutes while considering edge cases.

		let exceedsOverlap = overlapMins > maxOverlap;
		res.locals.overlap = { SHIFT_A, SHIFT_B, overlapMins, maxOverlap, exceedsOverlap };
		console.log(res.locals.overlap);
		next();
	} catch (err) {
		next(err);
	}
};

dbController.q4 = (req, res, next) => {
	const text = 'SELECT * FROM "facilities"';
	db.query(text)
		.then((data) => {
			res.locals.q4 = data.rows;
			next();
		})
		.catch((err) => next(err));
};

dbController.q5 = (req, res, next) => {
	const text = 'SELECT * FROM "facilities"';
	db.query(text)
		.then((data) => {
			res.locals.q5 = data.rows;
			next();
		})
		.catch((err) => next(err));
};

dbController.q6 = (req, res, next) => {
	const text = 'SELECT * FROM "facilities"';
	db.query(text)
		.then((data) => {
			res.locals.q6 = data.rows;
			next();
		})
		.catch((err) => next(err));
};
/*
{
    "SHIFT_A": {
        "shift_id": 1,
        "facility_id": 100,
        "shift_date": "2022-10-01T04:00:00.000Z",
        "start_time": "07:00:00",
        "end_time": "15:30:00",
        "facility_name": "Facility A"
    },
    "SHIFT_B": {
        "shift_id": 2,
        "facility_id": 100,
        "shift_date": "2022-10-01T04:00:00.000Z",
        "start_time": "15:00:00",
        "end_time": "23:00:00",
        "facility_name": "Facility A"
    }
}
  */
export default dbController;
