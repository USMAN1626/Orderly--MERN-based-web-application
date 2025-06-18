const Restaurant = require('../models/Restaurant');
const Food = require('../models/foodModel');
const Receipt = require('../models/Receipt');

const getAnalytics = async (req, res) => {
  try {
    // Get total restaurants
    const totalRestaurants = await Restaurant.countDocuments();
    
    // Get total menu items
    const totalMenuItems = await Food.countDocuments();
    
    // Get average price of menu items
    const avgPriceResult = await Food.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: "$price" }
        }
      }
    ]);
    
    // Get most popular restaurant based on order count
    const popularRestaurant = await Receipt.aggregate([
      {
        $group: {
          _id: "$restaurantId",
          orderCount: { $sum: 1 },
          restaurantName: { $first: "$restaurantName" }
        }
      },
      {
        $sort: { orderCount: -1 }
      },
      {
        $limit: 1
      }
    ]);

    // Get total orders
    const totalOrders = await Receipt.countDocuments();

    // Get total revenue
    const revenueResult = await Receipt.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    res.json({
      totalRestaurants,
      totalMenuItems,
      totalOrders,
      averagePrice: avgPriceResult[0]?.averagePrice || 0,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      popularRestaurant: popularRestaurant[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics
}; 