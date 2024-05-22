const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS

const app = express();
const port = process.env.PORT || 3000;

// Dummy ticket data with seat numbers
let tickets = [
  { id: 1, from: 'City A', to: 'City B', time: '10:00 AM', seats: 50, remainingSeats: 50, ticketClass: 'Economy', wifi: true, food: false, bookedSeats: [] },
  { id: 2, from: 'City B', to: 'City C', time: '12:00 PM', seats: 30, remainingSeats: 30, ticketClass: 'Business', wifi: true, food: true, bookedSeats: [] },
  { id: 3, from: 'City C', to: 'City A', time: '02:00 PM', seats: 20, remainingSeats: 20, ticketClass: 'First Class', wifi: false, food: true, bookedSeats: [] }
];

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Get all tickets
app.get('/tickets', (req, res) => {
  try {
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific ticket by ID
app.get('/tickets/:id', (req, res) => {
  const ticketId = parseInt(req.params.id); // Parse ID as a number
  const ticket = tickets.find(t => t.id === ticketId);

  if (ticket) {
    res.status(200).json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// Add a new ticket
app.post('/tickets', (req, res) => {
  try {
    const { from, to, time, seats, ticketClass, wifi, food } = req.body;
    const newTicket = {
      id: tickets.length + 1,
      from: from,
      to: to,
      time: time,
      seats: seats,
      remainingSeats: seats, // Initialize remainingSeats with the total number of seats
      ticketClass: ticketClass,
      wifi: wifi,
      food: food,
      bookedSeats: [] // Initialize with no booked seats
    };
    tickets.push(newTicket);
    res.status(201).json({ message: 'Ticket added successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error adding ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book a specific seat on a ticket
app.post('/book-seat', (req, res) => {
  try {
    const { id, seatNumber } = req.body;
    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.bookedSeats.includes(seatNumber)) {
      return res.status(400).json({ error: 'Seat already booked' });
    }

    if (seatNumber < 1 || seatNumber > ticket.seats) {
      return res.status(400).json({ error: 'Invalid seat number' });
    }

    ticket.bookedSeats.push(seatNumber);
    ticket.remainingSeats -= 1;

    res.status(200).json({ message: 'Seat booked successfully', ticket: ticket });
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
