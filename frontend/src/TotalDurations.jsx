import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart } from "react-minimal-pie-chart";

const TotalDurations = ({ subjects }) => {
  const [durations, setDurations] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    subjects.forEach(subject => {
      axios.post('http://localhost:5555/books/duration', null, { params: { subject } })
        .then(response => {
          if (!isCancelled) {
            setDurations(prevDurations => ({...prevDurations, [subject]: response.data.totalDuration}));
          }
        })
        .catch(error => console.log(error));
    });

    return () => {
      isCancelled = true;
    };
  }, [subjects]);

  // Transform durations into chart data
  useEffect(() => {
    const newData = subjects.map((subject, index) => ({
      title: subject,
      value: durations[subject] || 0,
      color: `hsl(${index * 360 / subjects.length}, 70%, 70%)` // Example color generation
    }));

    setChartData(newData);
  }, [subjects, durations]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
      <PieChart
      
        animate
        data={chartData}
        radius={40} // Smaller size
        lineWidth={30} // Thicker lines for each segment
        paddingAngle={5} // Space between segments
        rounded // Rounded edges of each segment
        style={{ height: '250px' }} // Smaller chart with fixed height
      />
    </div>
  );
};

export default TotalDurations;
