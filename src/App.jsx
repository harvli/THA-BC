import { useEffect, useState } from 'react';
import './App.css';
import Shifts from './components/Shifts.jsx'

function App() {
	const [shifts, setShifts] = useState([]);
	// render shifts on render
	useEffect(() => {
		console.log('useEffect launch');
		fetch('http://localhost:3000/q1_shifts', {
			headers: { 'Content-Type': 'application/json' },
		})
			.then((data) => data.json())
			.then((data) => {
				setShifts(data);
			})
			.catch((err) => console.log('Fetch Error: ', err));
	}, []);
	// select two shifts to update overlap minutes
	console.log('shifts', shifts);
  const shiftsArr = [];
  for (let i = 0; i < shifts.length; i++){
    shiftsArr.push(<Shifts info={shifts[i]} key={i}></Shifts>)
  }
	return (
		<div className='App'>
			<h1>hi</h1>
			<div className='shiftContainer'>
        {shiftsArr}
      </div>
		</div>
	);
}

export default App;
