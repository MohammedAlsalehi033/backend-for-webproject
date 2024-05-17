const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Dummy ticket data
let tickets = [
  { id: 1, from: 'City A', to: 'City B', time: '10:00 AM', seats: 50, ticketClass: 'Economy', wifi: true, food: false },
  { id: 2, from: 'City B', to: 'City C', time: '12:00 PM', seats: 30, ticketClass: 'Business', wifi: true, food: true },
  { id: 3, from: 'City C', to: 'City A', time: '02:00 PM', seats: 20, ticketClass: 'First Class', wifi: false, food: true }
];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Get all tickets
app.get('/tickets', (req, res) => {
  try {
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      ticketClass: ticketClass,
      wifi: wifi,
      food: food
    };
    tickets.push(newTicket);
    res.status(201).json({ message: 'Ticket added successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error adding ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port|| process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
