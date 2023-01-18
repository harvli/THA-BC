import { useEffect, useState } from 'react';

function Shifts({ info, selected, setSelected }) {
	const [start, setStart] = useState();
	const [end, setEnd] = useState();

	useEffect(() => {
		function convertTo12H(time) {
			let hour = time.slice(0, 2);
			let minutes = time.slice(2, 8);
			if (hour >= 12) {
				hour = parseInt(hour) - 12;
				minutes += ' PM';
			} else {
				hour = hour.slice(1, 2);
				minutes += ' AM';
			}
			return hour.toString() + minutes;
		}
		setStart(convertTo12H(info.start_time));
		setEnd(convertTo12H(info.end_time));
	}, []);

	const selectShifts = () => {
		console.log('shift selected', info);
		if (selected.includes(info)) {
			let index = selected.indexOf(info);
			setSelected((prevShifts) => {
				let arr = [...prevShifts];
				arr.splice(index, 1);
				return arr;
			});
		} else if (selected.length < 2) {
			setSelected((prevShifts) => [...prevShifts, info]);
		} else {
			setSelected((prevShifts) => {
				let arr = [...prevShifts];
				arr.shift();
				return arr;
			});
			setSelected((prevShifts) => [...prevShifts, info]);
		}
	};
	console.log(selected, selected.length);
	return (
		<button className='shift' onClick={selectShifts}>
			{/* <p>Shift ID: {info.shift_id}</p>
			<p>Facility ID: {info.facility_id}</p> */}
			<p>{info.facility_name}</p>
			<p>{info.shift_date.slice(0, 10)}</p>
			<p>
				{start} - {end}
			</p>
		</button>
	);
}

export default Shifts;
