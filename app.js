const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const Food = require('./models/Food');  
const Customer = require('./models/Customer');  
const Restaurant = require('./models/Restaurant');
const Cart = require('./models/Cart'); 
const Receipt = require('./models/Receipt'); 
const nodemailer = require('nodemailer'); 
const multer = require('multer'); 
const app = express();
const port = 5000;


// Middleware to allow CORS
app.use(cors());

// Use JSON parsing middleware to handle incoming requests with JSON payloads
app.use(express.json());

// Serve static files from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

const DB =  'mongodb+srv://221019:221019@foodbackend.q0mwj.mongodb.net/foodinfo?retryWrites=true&w=majority';


mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });
  
// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

  app.get('/api/fooditems', async (req, res) => {
    try {
      console.log('Fetching food items...');
      const foodItems = await Food.find();
      console.log('Food items found:', foodItems);
      if (foodItems.length > 0) {
        res.json(foodItems);
      } else {
        res.status(404).json({ message: 'No food items found' });
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      res.status(500).json({ message: 'Server Error', error });
    }
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.post('/api/restaurant/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, restaurantName, restaurantUrl } = req.body;

    const newRestaurant = new Restaurant({
      firstName,
      lastName,
      email,
      phone,
      restaurantName,
      restaurantUrl,
    });

    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant registered successfully' });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/customer/signup', async (req, res) => {
  try {
      console.log('Received signup request:', req.body); // Debugging log

      const { username, email, password } = req.body;

      // Validation: Ensure all fields are present
      if (!username || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if email already exists
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
          return res.status(400).json({ message: 'Email already registered' });
      }

      // Save the customer to the database
      const customer = new Customer({ username, email, password });
      await customer.save();

      res.status(201).json({ message: 'Customer registered successfully!' });
  } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/customer/login', async (req, res) => {
  try {
      const { username, email, password } = req.body;

      // Validate inputs
      if (!username || !email || !password) {
          return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      // Find customer by email and username
      const customer = await Customer.findOne({ email, username });
      if (!customer) {
          return res.status(400).json({ message: 'Invalid username, email, or password' });
      }

      // Compare plain text passwords
      if (password !== customer.password) {
          return res.status(400).json({ message: 'Invalid username, email, or password' });
      }

      // Respond with success
      res.status(200).json({
          message: 'Login successful!',
          customerId: customer._id,
      });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error', error });
  }
});


app.post('/api/cart', async (req, res) => {
  try {
    const { cart, customerEmail } = req.body;

    // Log to check if the request body is being received correctly
    console.log('Received cart data:', req.body);

    // Validate input
    if (!Array.isArray(cart) || !customerEmail) {
      return res.status(400).json({ message: 'Cart must be an array and email is required' });
    }

    // Find or create the customer's cart
    let customerCart = await Cart.findOne({ customerEmail });

    if (!customerCart) {
      customerCart = new Cart({
        customerEmail,
        items: [],
      });
    }

    // Process the cart items
    for (const item of cart) {
      if (!item.foodName || !item.quantity) {
        return res.status(400).json({ message: 'Each cart item must have foodName and quantity' });
      }

      const foodItem = await Food.findOne({ name: item.foodName });

      if (foodItem) {
        const existingItem = customerCart.items.find(i => i.foodName === foodItem.name);

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          customerCart.items.push({
            foodName: foodItem.name,
            price: foodItem.price,
            quantity: item.quantity,
          });
        }
      } else {
        return res.status(404).json({ message: `Food item ${item.foodName} not found` });
      }
    }

    await customerCart.save();
    res.status(200).json({ message: 'Cart updated successfully', cart: customerCart });
  } catch (error) {
    console.error('Error in /api/cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API endpoint to save receipt data
app.post('/api/receipt', async (req, res) => {
  try {
    const receiptData = req.body;
    const receipt = new Receipt(receiptData);
    await receipt.save();
    res.status(201).json({ message: 'Receipt saved successfully', receipt });
  } catch (error) {
    console.error('Error saving receipt:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password
  },
});

// API endpoint to handle password reset requests
app.post('/api/customer/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Save the reset token and expiry to the customer record
    customer.resetToken = resetToken;
    customer.resetTokenExpiry = resetTokenExpiry;
    await customer.save();

    // Send the reset link via email
    const resetLink = `http://localhost:5000/resetpass.html?token=${resetToken}`;
    const mailOptions = {
      to: email,
      from: 'your-email@gmail.com', // Replace with your email
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error });
      }
      res.status(200).json({ message: 'Password reset link sent to your email' });
    });
  } catch (error) {
    console.error('Error handling password reset request:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// API endpoint to handle password reset
app.post('/api/customer/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const customer = await Customer.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!customer) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the customer's password
    customer.password = newPassword;
    customer.resetToken = undefined;
    customer.resetTokenExpiry = undefined;
    await customer.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Endpoint to handle adding food items
app.post('/api/fooditems', async (req, res) => {
  try {
    const { name, category, price, restaurant } = req.body;
    console.log('Received food item:', { name, category, price, restaurant }); // Debugging log

    const newFoodItem = new Food({ name, category, price, restaurant });
    await newFoodItem.save();
    console.log('Food item saved:', newFoodItem); // Debugging log

    res.status(201).json({ message: 'Food item added successfully' });
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


app.post('/api/restaurant/login', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: 'Restaurant not found. Please register first.' });
    }

    // If email exists, login successful
    res.status(200).json({
      message: 'Login successful!',
      restaurantId: restaurant._id,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
