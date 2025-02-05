// FlightBoard.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import FlightBoard from './FlightBoard';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock Axios
jest.mock('axios');

// Mock Flight Data
const mockFlightData = {
  flights: [
    {
      id: 1,
      flightNumber: 101,
      airline: 'Airline A',
      origin: 'New York',
      destination: 'Los Angeles',
      departureTime: new Date(),
      status: 'On Time',
    },
    {
      id: 2,
      flightNumber: 102,
      airline: 'Airline B',
      origin: 'San Francisco',
      destination: 'Chicago',
      departureTime: new Date(),
      status: 'Delayed',
    },
  ],
};

describe('FlightBoard Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should render correct column names', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockFlightData });

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    await waitFor(() => screen.getByText('Flight 101'));

    // Check column names
    expect(screen.getByText(/Flight Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Airline/i)).toBeInTheDocument();
    expect(screen.getByText(/Origin/i)).toBeInTheDocument();
    expect(screen.getByText(/Departure Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Flight Details/i)).toBeInTheDocument();
  });

  it('should render the correct flight data', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockFlightData });

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    await waitFor(() => screen.getByText('Flight 101'));

    // Check if the flight data is rendered
    expect(screen.getByText('Flight 101')).toBeInTheDocument();
    expect(screen.getByText('Flight 102')).toBeInTheDocument();
    expect(screen.getByText('Airline A')).toBeInTheDocument();
    expect(screen.getByText('Airline B')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('Chicago')).toBeInTheDocument();
    expect(screen.getByText('On Time')).toBeInTheDocument();
    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });

  it('should show loading text when fetching data', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockFlightData });

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    // Check if "Loading..." text is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show an error message when API fails (404)', async () => {
    (axios.get as jest.Mock).mockRejectedValue({
      response: { status: 404, statusText: 'Not Found' },
    });

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    await waitFor(() => screen.getByText('Flight details are unavailable (404). Please check the flight ID.'));
    expect(screen.getByText('Flight details are unavailable (404). Please check the flight ID.')).toBeInTheDocument();
  });

  it('should show an error message when API fails (500)', async () => {
    (axios.get as jest.Mock).mockRejectedValue({
      response: { status: 500, statusText: 'Internal Server Error' },
    });

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    await waitFor(() => screen.getByText('Internal server error. Please try again later.'));
    expect(screen.getByText('Internal server error. Please try again later.')).toBeInTheDocument();
  });

  it('should show a network error message when there is no response', async () => {
    (axios.get as jest.Mock).mockRejectedValue({ request: {} });

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    await waitFor(() => screen.getByText('Network error: Please check your internet connection or try again later.'));
    expect(screen.getByText('Network error: Please check your internet connection or try again later.')).toBeInTheDocument();
  });

  it('should show error when there is a general error', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('General Error'));

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    await waitFor(() => screen.getByText('An unknown error occurred.'));
    expect(screen.getByText('An unknown error occurred.')).toBeInTheDocument();
  });

  it('should show no flights available message when the flight list is empty', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { flights: [] } });

    render(
      <Router>
        <FlightBoard />
      </Router>
    );

    await waitFor(() => screen.getByText('No flights available'));
    expect(screen.getByText('No flights available')).toBeInTheDocument();
  });
});
