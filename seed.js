const mongoose = require("mongoose");
const Menu = require("./models/menu.model");

mongoose.connect("mongodb://127.0.0.1:27017/snapserve");

const seedMenu = async () => {
  await Menu.deleteMany();

  const menuItems = [
    // BREWS
    { name: "Espresso", category: "BREWS", price: 95, available: true },
    { name: "Americano", category: "BREWS", price: 114, available: true },
    { name: "Cappuccino", category: "BREWS", price: 133, available: true },
    { name: "Mocha", category: "BREWS", price: 152, available: true },
    { name: "Cold Coffee", category: "BREWS", price: 190, available: true },
    { name: "Masala Chai", category: "BREWS", price: 57, available: true },
    { name: "Green Tea", category: "BREWS", price: 86, available: true },
    { name: "Ginger Lemon Honey Tea", category: "BREWS", price: 116, available: true },
    { name: "Milk Coffee", category: "BREWS", price: 95, available: true },
    { name: "Filter Coffee", category: "BREWS", price: 95, available: true },
    
    // LASSI
    { name: "Sweet Lassi", category: "LASSI", price: 134, available: true },
    { name: "Masala Lassi", category: "LASSI", price: 134, available: true },
    { name: "Banana & Honey Lassi", category: "LASSI", price: 153, available: true },
    
    // SLOW PRESSED FRESH JUICES
    { name: "Watermelon Juice", category: "SLOW PRESSED FRESH JUICES", price: 153, available: true },
    { name: "Pineapple Juice", category: "SLOW PRESSED FRESH JUICES", price: 200, available: true },
    { name: "Orange Juice", category: "SLOW PRESSED FRESH JUICES", price: 210, available: true },
    
    // SOFT BEVERAGES
    { name: "Aerated Drinks Can", category: "SOFT BEVERAGES", price: 71, available: true },
    { name: "Schweppes Tonic Water", category: "SOFT BEVERAGES", price: 95, available: true },
    { name: "Schweppes Ginger Ale", category: "SOFT BEVERAGES", price: 95, available: true },
    { name: "Red Bull", category: "SOFT BEVERAGES", price: 200, available: true },
    { name: "Fresh Lime Soda / Water", category: "SOFT BEVERAGES", price: 95, available: true },
    { name: "Coconut Water", category: "SOFT BEVERAGES", price: 153, available: true },
    { name: "Bottle Of Water", category: "SOFT BEVERAGES", price: 29, available: true },
    
    // BREAKFAST THALI
    { name: "Indian Breakfast", category: "BREAKFAST THALI", price: 296, available: true },
    { name: "Continental Breakfast", category: "BREAKFAST THALI", price: 296, available: true },
    { name: "English Breakfast", category: "BREAKFAST THALI", price: 458, available: true },
    
    // BREAKFAST ADD-ONS
    { name: "Aloo Parantha", category: "BREAKFAST ADD-ONS", price: 152, available: true },
    { name: "Paneer Parantha", category: "BREAKFAST ADD-ONS", price: 200, available: true },
    { name: "Cornflakes with Milk", category: "BREAKFAST ADD-ONS", price: 133, available: true },
    { name: "Crunchy Muesli with Milk", category: "BREAKFAST ADD-ONS", price: 162, available: true },
    { name: "Baked Beans with Toast", category: "BREAKFAST ADD-ONS", price: 210, available: true },
    { name: "Homemade Toast (Butter & Jam)", category: "BREAKFAST ADD-ONS", price: 76, available: true },
    
    // EGGS
    { name: "Fried Egg", category: "EGGS", price: 162, available: true },
    { name: "Plain Omelette", category: "EGGS", price: 162, available: true },
    { name: "Masala Omelette", category: "EGGS", price: 171, available: true },
    { name: "Cheese Omelette", category: "EGGS", price: 181, available: true },
    { name: "Scrambled Egg", category: "EGGS", price: 162, available: true },
    { name: "Boiled Egg", category: "EGGS", price: 162, available: true },
    
    // ALL DAY FRESHLY BAKED
    { name: "Butter Croissant", category: "ALL DAY FRESHLY BAKED", price: 76, available: true },
    { name: "Cheese Croissant", category: "ALL DAY FRESHLY BAKED", price: 86, available: true },
    { name: "Chocolate Croissant", category: "ALL DAY FRESHLY BAKED", price: 95, available: true },
    { name: "Cinnamon Danish Pastry", category: "ALL DAY FRESHLY BAKED", price: 124, available: true },
    { name: "Vegetable Puff", category: "ALL DAY FRESHLY BAKED", price: 105, available: true },
    { name: "Chicken Puff", category: "ALL DAY FRESHLY BAKED", price: 124, available: true },
    
    // SANDWICHES & BURGERS
    { name: "Coleslaw Sandwich", category: "SANDWICHES & BURGERS", price: 219, available: true },
    { name: "Tomato, Cucumber & Cheese Sandwich", category: "SANDWICHES & BURGERS", price: 229, available: true },
    { name: "Chicken Ham & Cheese Sandwich", category: "SANDWICHES & BURGERS", price: 324, available: true },
    { name: "Focaccia Paneer Tikka Sandwich", category: "SANDWICHES & BURGERS", price: 324, available: true },
    { name: "Focaccia Chicken Tikka Sandwich", category: "SANDWICHES & BURGERS", price: 343, available: true },
    { name: "Vegetable Burger", category: "SANDWICHES & BURGERS", price: 229, available: true },
    { name: "Chicken Burger", category: "SANDWICHES & BURGERS", price: 248, available: true },
    
    // STARTERS
    { name: "French Fries", category: "STARTERS", price: 171, available: true },
    { name: "Mexican Potato Wedges", category: "STARTERS", price: 191, available: true },
    { name: "Masala Peanut", category: "STARTERS", price: 159, available: true },
    { name: "Masala Papad", category: "STARTERS", price: 119, available: true },
    { name: "Roasted Papad", category: "STARTERS", price: 69, available: true },
    { name: "Vegetable Cutlet", category: "STARTERS", price: 191, available: true },
    { name: "Crispy Chicken Salsa", category: "STARTERS", price: 314, available: true },
    { name: "Fish N Chips", category: "STARTERS", price: 514, available: true },
    
    // PIZZAS
    { name: "Margherita Pizza", category: "PIZZAS", price: 239, available: true },
    { name: "Fresh From The Garden Pizza", category: "PIZZAS", price: 305, available: true },
    { name: "Peri Peri Pizza", category: "PIZZAS", price: 324, available: true },
    { name: "Al Funghi Pizza", category: "PIZZAS", price: 324, available: true },
    { name: "Chickenara Pizza", category: "PIZZAS", price: 343, available: true },
    
    // SIZZLERS
    { name: "Vegetable Kebab Sizzler", category: "SIZZLERS", price: 458, available: true },
    { name: "Chicken Kebab Sizzler", category: "SIZZLERS", price: 600, available: true },
    { name: "Paneer Shashlik", category: "SIZZLERS", price: 458, available: true },
    { name: "Chicken Shashlik", category: "SIZZLERS", price: 572, available: true },
    
    // KATHI ROLLS
    { name: "Paneer Kathi Roll", category: "KATHI ROLLS", price: 210, available: true },
    { name: "Chicken Kathi Roll", category: "KATHI ROLLS", price: 229, available: true },
    
    // SOUPS
    { name: "Cream Of Tomato Soup", category: "SOUPS", price: 200, available: true },
    { name: "Chicken Clear Soup", category: "SOUPS", price: 200, available: true },
    { name: "Sweet Corn Vegetable Soup", category: "SOUPS", price: 200, available: true },
    { name: "Sweet Corn Chicken Soup", category: "SOUPS", price: 200, available: true },
    
    // SALADS
    { name: "Fresh Garden Salad", category: "SALADS", price: 124, available: true },
    { name: "Sweet Corn & Sprouts Salad", category: "SALADS", price: 200, available: true },
    { name: "Aloo Chana Chaat Salad", category: "SALADS", price: 238, available: true },
    
    // YOGURT
    { name: "Mix Vegetable Raita", category: "YOGURT", price: 149, available: true },
    { name: "Boondi Raita", category: "YOGURT", price: 149, available: true },
    { name: "Pineapple Raita", category: "YOGURT", price: 159, available: true },
    { name: "Plain Curd", category: "YOGURT", price: 120, available: true },
    
    // WESTERN TREATS
    { name: "Sauteed Vegetable", category: "WESTERN TREATS", price: 320, available: true },
    { name: "Vegetable Au Gratin", category: "WESTERN TREATS", price: 330, available: true },
    { name: "Grilled Chicken Florentine", category: "WESTERN TREATS", price: 400, available: true },
    { name: "Chicken Stroganoff", category: "WESTERN TREATS", price: 400, available: true },
    
    // PASTA
    { name: "Vegetable Pasta", category: "PASTA", price: 305, available: true },
    { name: "Chicken Pasta", category: "PASTA", price: 324, available: true },
    
    // RICE & BIRYANIS
    { name: "Steam Rice", category: "RICE & BIRYANIS", price: 162, available: true },
    { name: "Jeera Rice", category: "RICE & BIRYANIS", price: 181, available: true },
    { name: "Curd Rice", category: "RICE & BIRYANIS", price: 229, available: true },
    { name: "Dal Khichadi", category: "RICE & BIRYANIS", price: 286, available: true },
    { name: "Vegetable Biryani", category: "RICE & BIRYANIS", price: 353, available: true },
    { name: "Chicken Biryani", category: "RICE & BIRYANIS", price: 381, available: true },
    { name: "Mutton Biryani", category: "RICE & BIRYANIS", price: 620, available: true },
    
    // INDIAN BREADS
    { name: "Laccha Paratha", category: "INDIAN BREADS", price: 79, available: true },
    { name: "Pudina Paratha", category: "INDIAN BREADS", price: 79, available: true },
    { name: "Aloo Paratha", category: "INDIAN BREADS", price: 152, available: true },
    { name: "Paneer Paratha", category: "INDIAN BREADS", price: 200, available: true },
    { name: "Tandoori Roti", category: "INDIAN BREADS", price: 48, available: true },
    { name: "Butter Tandoori Roti", category: "INDIAN BREADS", price: 57, available: true },
    { name: "Butter Garlic Naan", category: "INDIAN BREADS", price: 114, available: true },
    { name: "Butter Naan", category: "INDIAN BREADS", price: 100, available: true },
    
    // DESSERTS & CAKES
    { name: "Gulab Jamun", category: "DESSERTS & CAKES", price: 114, available: true },
    { name: "Walnut Brownie", category: "DESSERTS & CAKES", price: 124, available: true },
    { name: "French Apple Tart", category: "DESSERTS & CAKES", price: 134, available: true },
    { name: "Blueberry Cheese Cake Slice", category: "DESSERTS & CAKES", price: 171, available: true },
    { name: "Mango Cheese Cake Slice", category: "DESSERTS & CAKES", price: 171, available: true },
    { name: "Chocolate Truffle Pastry", category: "DESSERTS & CAKES", price: 124, available: true },
    { name: "Chocolate Mousse", category: "DESSERTS & CAKES", price: 105, available: true },
    
    // INDIAN CURRIES
    { name: "Jeera Aloo", category: "INDIAN CURRIES", price: 219, available: true },
    { name: "Paneer Makhani", category: "INDIAN CURRIES", price: 343, available: true },
    { name: "Paneer Tikka Butter Masala", category: "INDIAN CURRIES", price: 353, available: true },
    { name: "Kadhai Murgh (4pc)", category: "INDIAN CURRIES", price: 467, available: true },
    { name: "Butter Chicken (2pc)", category: "INDIAN CURRIES", price: 324, available: true },
    { name: "Chicken Curry (4pc)", category: "INDIAN CURRIES", price: 438, available: true },
    { name: "Fish Curry", category: "INDIAN CURRIES", price: 515, available: true }
  ];

  await Menu.insertMany(menuItems);

  console.log("Menu seeded with " + menuItems.length + " items");
  process.exit();
};

seedMenu();

