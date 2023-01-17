import express from 'express';
import dbRouter from './dbRouter.js';
const app = express();

const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Establish route at root path for dbRouter to organize requests
app.use('/', dbRouter);

app.use('*', (req, res) => {
	return res.status(404);
});

app.use((err, req, res, next) => {
	const defaultErr = {
		log: 'Express error handler',
		status: 500,
		message: { err: 'An error occurred' },
	};
	const errorObj = Object.assign({}, defaultErr, err);
	console.log(errorObj.log);
	return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
	console.log(`************* EXPRESS server is listening on http://localhost:${port}/`);
});
