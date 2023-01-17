import db from './db.js'

const dbController = {};

dbController.getShifts = (req, res, next) => {
  const text = 'SELECT * FROM question_one_shifts';
  db.query(text)
    .then((data) => {
      console.log(data);
      next();
    })
    .catch((err) => next(err));
} 

export default dbController;