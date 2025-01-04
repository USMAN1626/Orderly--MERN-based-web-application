// Use the `foodinfo` database
use('foodinfo');


// Insert sample documents into the `foodbackend` collection
db.foodbackend.insertMany([
  { 
    name: "Double Beef Burger", 
    category: "Burgers", 
    price: 700, 
    restaurant: "Food Xpertz", 
    image: "beef.jpg" 
  },
  { 
    name: "Special Zinger Burger", 
    category: "Burgers", 
    price: 500, 
    restaurant: "Cheezious", 
    image: "zinger.png" 
  },
  { 
    name: "Zinger Burger Deal", 
    category: "Burgers", 
    price: 1000, 
    restaurant: "Burger o'clock", 
    image: "burgerdeal1.png" 
  },
  { 
    name: "Beef Patty Burger Deal", 
    category: "Burgers", 
    price: 1200, 
    restaurant: "Burger o'clock", 
    image: "burgerdeal2.png" 
  },
  { 
    name: "Cheesy Pizza", 
    category: "Pizza", 
    price: 1900, 
    restaurant: "21 Pizza Bar", 
    image: "pizza.jpg" 
  },
  { 
    name: "Special Pepproni Pizza", 
    category: "Pizza", 
    price: 1600, 
    restaurant: "Papa Johns", 
    image: "ppizza.png" 
  },
  { 
    name: "Special Pizza Deal", 
    category: "Pizza", 
    price: 2500, 
    restaurant: "Eat & Repeat", 
    image: "pizzadeal1.png" 
  },
  { 
    name: "Buy Get 1 free", 
    category: "Pizza", 
    price: 1500, 
    restaurant: "Food Xpertz", 
    image: "pizzadeal2.png" 
  },
  { 
    name: "Chocolate Chips Cookies", 
    category: "Dessert", 
    price: 1700, 
    restaurant: "Sweet Tooth", 
    image: "cookies.png" 
  },
  { 
    name: "Mango Cheesecake", 
    category: "Dessert", 
    price: 2600, 
    restaurant: "The Cafe", 
    image: "mangocake.png" 
  },
  { 
    name: "Peanut Butter Brownies", 
    category: "Dessert", 
    price: 2200, 
    restaurant: "Layers Bakery", 
    image: "PBrownies.png" 
  },
  { 
    name: "Cream Stuffed Donuts", 
    category: "Dessert", 
    price: 2000, 
    restaurant: "The Cafe", 
    image: "docnuts.png" 
  },
  { 
    name: "Bibimbap", 
    category: "Noodles", 
    price: 1000, 
    restaurant: "Kang Fao", 
    image: "noodle1.png" 
  },
  { 
    name: "Tereyaki Noodles", 
    category: "Noodles", 
    price: 1200, 
    restaurant: "Noodles Shop", 
    image: "noodle.png" 
  },
  { 
    name: "Ramen Noodles", 
    category: "Noodles", 
    price: 1400, 
    restaurant: "Kang Fao", 
    image: "noodle2.png" 
  },
  { 
    name: "Grill Sandwitch", 
    category: "Sandwitch", 
    price: 250, 
    restaurant: "Cheezious", 
    image: "sand.png" 
  },
  { 
    name: "Sandwitch & Fries", 
    category: "Sandwitch", 
    price: 500, 
    restaurant: "Cafe 101", 
    image: "s1.png" 
  },
  { 
    name: "Hung Curd Sandwitch", 
    category: "Sandwitch", 
    price: 670, 
    restaurant: "Fork it Cafe", 
    image: "sandwitch.png" 
  },
  { 
    name: "Hyderbadi Biryani", 
    category: "Asian", 
    price: 1600, 
    restaurant: "Biryani Center", 
    image: "hbiryani.png" 
  },
  { 
    name: "Mutton Biryani", 
    category: "Asian", 
    price: 1900, 
    restaurant: "Desi Pakwan", 
    image: "mbiryani.png" 
  }
]);

db.foodbackend.find().pretty();