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
// ** Important Find on Assignment **
// One thing I noticed while working on the last 3 questions of the assessment, nurse_ID: 1010, Mark is an RN in the Pre-interview Environment Setup Instructions given as (1010,'Mark','RN'). However the RN position filled a LPN role as shown: (206,101,'LPN',2), (206,1010), with the Job_ID 206 requiring a LPN, but Mark is an RN. However, on the technical interview sheet Version B, Mark is an LPN nurse type. This is just one inconsistency I noticed, so the results will be a bit different than what is expected.

dbController.q4 = (req, res, next) => {
	const text = `SELECT jobs.*,
	jobs.total_number_nurses_needed - (SELECT COUNT(*) FROM nurse_hired_jobs WHERE job_id = jobs.job_id) as remaining_jobs
	FROM jobs
	ORDER BY facility_id, nurse_type_needed;`;
	db.query(text)
		.then((data) => {
			res.locals.q4 = data.rows;
			next();
		})
		.catch((err) => next(err));
};

dbController.q5 = (req, res, next) => {
	const text = `WITH remaining_jobs AS (
    SELECT jobs.*,
		jobs.total_number_nurses_needed - (SELECT COUNT(*) FROM nurse_hired_jobs WHERE job_id = jobs.job_id) as remaining_spots
		FROM jobs
		ORDER BY facility_id, nurse_type_needed
	)

	SELECT nurses.nurse_id, nurses.nurse_name, nurses.nurse_type, COUNT(remaining_jobs.remaining_spots) AS total_jobs
	FROM nurses
	LEFT JOIN remaining_jobs ON nurses.nurse_type = remaining_jobs.nurse_type_needed
	WHERE remaining_jobs.remaining_spots > 0
	GROUP BY nurses.nurse_id, nurses.nurse_name, nurses.nurse_type
	ORDER BY nurse_type`;
	db.query(text)
		.then((data) => {
			res.locals.q5 = data.rows;
			next();
		})
		.catch((err) => next(err));
};

dbController.q6 = (req, res, next) => {
	const text = `WITH person_facility AS (
		SELECT j.facility_id FROM nurse_hired_jobs nhj
		JOIN nurses n ON nhj.nurse_id = n.nurse_id
		JOIN jobs j ON nhj.job_id = j.job_id
		WHERE n.nurse_name = 'Anne'
		),
		co_workers AS (
		SELECT DISTINCT n.nurse_name FROM nurse_hired_jobs nhj
		JOIN nurses n ON nhj.nurse_id = n.nurse_id
		JOIN jobs j ON nhj.job_id = j.job_id
		JOIN person_facility af ON j.facility_id = af.facility_id
		WHERE n.nurse_name != 'Anne'
		)
		SELECT * FROM co_workers;`;
	db.query(text)
		.then((data) => {
			res.locals.q6 = data.rows;
			next();
		})
		.catch((err) => next(err));
};

/*
req.body:
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
