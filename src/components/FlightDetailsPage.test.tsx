import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FlightDetailsPage from './FlightDetailsPage'; // Adjust the import path
import { act } from 'react-dom/test-utils';

// Mock fetch API
global.fetch = jest.fn();

describe('FlightDetailsPage', () => {
  const flightData = {
    id: '1',
    flightNumber: 'AF123',
    airline: 'Air France',
    origin: 'Paris',
    destination: 'New York',
    departureTime: '2025-02-20T10:00:00Z',
    status: 'On time',
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test case 1: Ensure loading state is shown
  test('should show loading state initially', () => {
    // Arrange: Simulate a successful response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => flightData,
    });

    // Act: Render the component
    render(
      <Router>
        <FlightDetailsPage />
      </Router>
    );

    // Assert: Check if loading text is shown
    expect(screen.getByText(/Loading flight details.../i)).toBeInTheDocument();
  });

  // Test case 2: Ensure error state is shown when API fails
  test('should show error state if fetching fails', async () => {
    // Arrange: Simulate a failed API request
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch flight details'));

    // Act: Render the component
    render(
      <Router>
        <FlightDetailsPage />
      </Router>
    );

    // Assert: Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(/Error: Failed to fetch flight details/)).toBeInTheDocument());
  });

  // Test case 3: Ensure the correct data is displayed
  test('should display flight details correctly', async () => {
    // Arrange: Simulate a successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => flightData,
    });

    // Act: Render the component
    render(
      <Router>
        <FlightDetailsPage />
      </Router>
    );

    // Assert: Check if flight details are rendered correctly
    await waitFor(() => {
      expect(screen.getByText(/Flight Details/i)).toBeInTheDocument();
      expect(screen.getByText(/AF123/i)).toBeInTheDocument();
      expect(screen.getByText(/Air France/i)).toBeInTheDocument();
      expect(screen.getByText(/Paris/i)).toBeInTheDocument();
      expect(screen.getByText(/New York/i)).toBeInTheDocument();
      expect(screen.getByText(/On time/i)).toBeInTheDocument();
    });
  });

  // Test case 4: Ensure correct error message is shown for 404 errors
  test('should handle invalid flight id (404)', async () => {
    // Arrange: Simulate a 404 error
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Flight not found' }),
    });

    // Act: Render the component
    render(
      <Router>
        <FlightDetailsPage />
      </Router>
    );

    // Assert: Wait for the error message to be shown
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch flight details/)).toBeInTheDocument();
    });
  });

  // Test case 5: Test network error scenario
  test('should handle network error', async () => {
    // Arrange: Simulate a network error
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // Act: Render the component
    render(
      <Router>
        <FlightDetailsPage />
      </Router>
    );

    // Assert: Check if the network error is handled
    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });
  });

  // Test case 6: Ensure the back button works (navigates back to flight board)
  test('should navigate back to the flight board when clicking "Back to Flight Board" button', async () => {
    // Arrange: Mock the successful API response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => flightData,
    });

    // Act: Render the component and click on the back button
    render(
      <Router>
        <FlightDetailsPage />
      </Router>
    );

    const backButton = screen.getByText(/Back to Flight Board/);
    expect(backButton).toBeInTheDocument();
    // Simulate a button click
    act(() => {
      backButton.click();
    });

    // Assert: Check if the history.back() method was called
    // Since it's window.history.back(), you can spy on this method to check if it was triggered
    expect(window.history.back).toHaveBeenCalled();
  });
});
