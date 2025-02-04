import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Link } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';

// Define types for the table data
interface Flight {
  id: number;
  flightNumber: number;
  airline: string;
  origin: string;
  destination: string;
  departureTime: Date;
  status: string;
}

const FlightBoard: React.FC = () => {
  // Initialize the state for the table data
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data from the API
  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Flight[]>("https://flight-status-mock.core.travelopia.cloud/flights");
      // Update the table data with the fetched response
      setFlights(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        // Axios error handling
        if (err.response) {
          // The server responded with a status code outside the range of 2xx
          if (err.response.status === 404) {
            setError("Flight details are unavailable (404). Please check the flight ID.");
          } else if (err.response.status === 429) {
            setError("API rate limit exceeded. Please try again later.");
          } else if (err.response.status === 500) {
            setError("Internal server error. Please try again later.");
          } else {
            setError(`Error: ${err.response.status} - ${err.response.statusText}`);
          }
        } else if (err.request) {
          // The request was made but no response was received (network error)
          setError("Network error: Please check your internet connection or try again later.");
        } else {
          // Something went wrong in setting up the request
          setError("Error: " + err.message);
        }
      } else {
        // General error handling
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Poll the API every 5 seconds for real-time updates
  useEffect(() => {
    // Fetch data initially when the component mounts
    fetchFlights();

    // Set up an interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchFlights, 5000); // 5 seconds interval

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run once on mount

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">Flight Board</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Flight Number</strong></TableCell>
              <TableCell><strong>Airline</strong></TableCell>
              <TableCell><strong>Origin</strong></TableCell>
              <TableCell><strong>Departure Time</strong></TableCell>
              <TableCell><strong>Destination</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Flight Details</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight) => (
              <TableRow key={flight.id} hover>
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>{flight.airline}</TableCell>
                <TableCell>{flight.origin}</TableCell>
                <TableCell>{flight.departureTime.toString()}</TableCell>
                <TableCell>{flight.destination}</TableCell>
                <TableCell>{flight.status}</TableCell>
                <TableCell>
                  <Link to={`/flight/${flight.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>          
  );
};

export default FlightBoard;