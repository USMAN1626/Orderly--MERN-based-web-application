require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/foodModel');

const foodData = [
  {
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 800,
    restaurant: "Pizza Palace",
    image: "ppizza.png"
  },
  {
    name: "Chicken Biryani",
    category: "Desi",
    price: 600,
    restaurant: "Desi Delights",
    image: "hbiryani.png"
  },
  {
    name: "Coca-Cola (Can)",
    category: "Drinks",
    price: 120,
    restaurant: "Beverage Hub",
    image: "cocacola.png"
  },
  {
    name: "Grilled Chicken Sandwich",
    category: "Sandwich",
    price: 380,
    restaurant: "Sandwich Stop",
    image: "sandwitch.png"
  },
  {
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 300,
    restaurant: "Sweet Treats",
    image: "PBrownies.png"
  },
  {
    name: "Beef Noodles",
    category: "Noodles",
    price: 550,
    restaurant: "Noodle House",
    image: "noodle.png"
  },
  {
    name: "Chicken Pasta Alfredo",
    category: "Pasta",
    price: 700,
    restaurant: "Pasta Point",
    image: "pasta.jpg"
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/hotel-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    const deleteResult = await Food.deleteMany({});
    console.log('Cleared existing food items:', deleteResult.deletedCount);

    // Insert new data
    const insertResult = await Food.insertMany(foodData);
    console.log('Successfully seeded food items:', insertResult.length);
    console.log('Seeded items:', insertResult.map(item => ({
      name: item.name,
      category: item.category,
      image: item.image
    })));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

module.exports = seedDatabase; 