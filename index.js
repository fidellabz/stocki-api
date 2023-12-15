const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connectDB = require('./database/db.js');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB()


// Define routes
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
