import { useEffect, useState } from 'react';

function Shifts({ info }) {
	const [count, setCount] = useState(0);

	return (
		<div className='shift'>
			<p>Shift id: {info.shift_id}</p>
			<p>Facility_id: {info.facility_id}</p>
			<p>Shift_date: {info.shift_date}</p>
			<p>Start_time: {info.start_time}</p>
			<p>End_time: {info.end_time}</p>
			<p>Facility_name: {info.facility_name}</p>
		</div>
	);
}

export default Shifts;
