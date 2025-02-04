import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Grid, CircularProgress, Button } from '@mui/material';

// Interface for flight details
interface FlightDetails {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: Date;
  status: string;
}

const FlightDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the flight ID from the URL params
  const [flight, setFlight] = useState<FlightDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the flight details from the API
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`https://flight-status-mock.core.travelopia.cloud/flights/${id}`); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Failed to fetch flight details');
        }
        const data = await response.json();
        data.departureTime = new Date(data.departureTime).toString().replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1");
        setFlight(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);
  
  if (loading) return <div>Loading flight details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="sm" sx={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>Flight Details</Typography>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2">{flight?.flightNumber}</Typography>
          <Typography color="textSecondary">Flight Info</Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography><strong>Flight Number:</strong> {flight?.flightNumber}</Typography>
              <Typography><strong>Airline:</strong> {flight?.airline}</Typography>
              <Typography><strong>Origin:</strong> {flight?.origin}</Typography>
              <Typography><strong>Departure:</strong> {flight?.departureTime.toString()}</Typography>
              <Typography><strong>Destination:</strong> {flight?.destination}</Typography>
              <Typography><strong>Status:</strong> {flight?.status}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Button variant="contained" color="primary" fullWidth onClick={() => window.history.back()}>
        Back to Flight Board
      </Button>
    </Container>
  );
};

export default FlightDetailsPage;