import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5555/books/${id}`);
        setBook(response.data);
        fetchChartData(response.data.title); // Assuming title is the parameter for chart data
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    const fetchChartData = (subject) => {
      // Helper function to generate the last 7 days
      const generateWeekDates = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dates.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
        }
        return dates;
      };

      const weekDates = generateWeekDates();

      axios.post('http://localhost:5555/books/duration/weekly', null, {
        params: { subject }
      })
        .then((response) => {
          const apiData = response.data.reduce((acc, cur) => {
            acc[cur.date] = cur.totalDuration;
            return acc;
          }, {});

          // Generate chart data, using apiData where available, defaulting to 0
          const chartData = {
            labels: weekDates,
            datasets: [{
              label: 'Duration',
              data: weekDates.map(date => apiData[date] || 0),
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'transparent', // Remove the border
              borderRadius: 20, // Rounded corners
              borderWidth: 0, // Remove the outline
            }]
          };
          setChartData(chartData);
        })
        .catch((error) => {
          console.error('Error fetching chart data:', error);
          setChartData(null); // Reset the chart data if there's an error
        });
    };

    fetchBookData();
  }, [id]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: 'black' // Black font for legend
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'black' // Black font for x-axis labels
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: 'black' // Black font for y-axis labels
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 20,
        borderWidth: 0,
      }
    }
  };

  return (
    <div className='p-4 flex flex-col items-center'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show Task</h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className='flex flex-col border-2 border-white bg-blue-50 rounded-xl w-fit p-4'>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Title</span>
              <span className='book-info-text'>{book.title}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Description</span>
              <span className='book-info-text'>{book.author}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Duration</span>
              <span className='book-info-text'>{book.publishYear} min</span>
            </div>
          </div>

          <h1 className='text-center text-3xl my-4'>Subject Daily Time</h1>

          {chartData && (
            <div className='my-4' style={{ maxWidth: '600px', width: '100%' }}>
              <Bar data={chartData} options={options} />
            </div>
          )}
        </>
      )}
    </div>
  );

};

export default ShowBook;
