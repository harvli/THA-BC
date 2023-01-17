import db from './db.js'

const dbController = {};

dbController.getShifts = (req, res, next) => {
  const text = 'SELECT * FROM "question_one_shifts" INNER JOIN "facilities" ON question_one_shifts.facility_id = facilities.facility_id';
  db.query(text)
    .then((data) => {
      console.log(data.rows);
      res.locals.data = data.rows
      next();
    })
    .catch((err) => next(err));
} 

export default dbController;