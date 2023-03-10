import { useEffect, useState } from 'react';
import './App.css';
import Shifts from './components/Shifts.jsx';

function App() {
	const [shifts, setShifts] = useState([]);
	const [selected, setSelected] = useState([]);
	const [overlap, setOverlap] = useState({
		overlapMins: '0',
		maxOverlap: '0',
		exceedsOverlap: 'N/A',
	});

	// render shifts on mount
	useEffect(() => {
		// console.log('useEffect launch');
		fetch('/api/q1_shifts', {
			headers: { 'Content-Type': 'application/json' },
		})
			.then((data) => data.json())
			.then((data) => {
				setShifts(data);
			})
			.catch((err) => console.log('Fetch Error: ', err));
	}, []);

	const exeQ4 = () => {
		fetch('/api/q4', {
			headers: { 'Content-Type': 'application/json' },
		})
			.then((data) => data.json())
			.then((data) => {
				console.log(data);
			})
			.catch((err) => console.log('Fetch Error: ', err));
	};
	const exeQ5 = () => {
		fetch('/api/q5', {
			headers: { 'Content-Type': 'application/json' },
		})
			.then((data) => data.json())
			.then((data) => {
				console.log(data);
			})
			.catch((err) => console.log('Fetch Error: ', err));
	};
	const exeQ6 = () => {
		fetch('/api/q6', {
			headers: { 'Content-Type': 'application/json' },
		})
			.then((data) => data.json())
			.then((data) => {
				console.log(data);
			})
			.catch((err) => console.log('Fetch Error: ', err));
	};

	const updateOverlap = () => {
		if (selected.length === 2) {
			fetch('http://localhost:3000/api/overlapThreshold', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					SHIFT_A: selected[0],
					SHIFT_B: selected[1],
				}),
			})
				.then((data) => data.json())
				.then((data) => {
					setOverlap(data);
				})
				.catch((err) => console.log('Fetch Error: ', err));
		} else {
			setOverlap({ overlapMins: '0', maxOverlap: '0', exceedsOverlap: 'N/A' });
		}
	};
	// select two shifts to update overlap minutes
	const shiftsArr = [];
	for (let i = 0; i < shifts.length; i++) {
		shiftsArr.push(
			<Shifts info={shifts[i]} key={i} selected={selected} setSelected={setSelected}></Shifts>
		);
	}
	return (
		<div className='App'>
			<h1>Harvey Li</h1>
			<button className='q4Button' onClick={exeQ4}>
				Execute Q4 Query
			</button>
			<button className='q5Button' onClick={exeQ5}>
				Execute Q5 Query
			</button>
			<button className='q6Button' onClick={exeQ6}>
				Execute Q6 Query
			</button>
			<div className='overlapContainer'>
				{/* <p>
					Shifts Selected: {selected[0].shift_id} {selected[1].shift_id}
				</p> */}
				<p>Overlap Minutes: {overlap.overlapMins ?? 0} minutes</p>
				<p>Maximum Overlap Threshold: {`${overlap.maxOverlap}`} minutes</p>
				<p>Exceeds Overlap Threshold: {`${overlap.exceedsOverlap}`.toUpperCase()}</p>
				<button className='submitButton' onClick={updateOverlap}>
					Submit
				</button>
			</div>
			<div className='shiftContainer'>{shiftsArr}</div>
		</div>
	);
}

export default App;
