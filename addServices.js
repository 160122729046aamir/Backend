require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

// Correct and clean data
const services = [
  {
    title: "Electrical Engineering",
    image: "/assets/electrical.png",
    description:
      "Electrical Engineering Services offer safe and efficient electrical system design, installation, and maintenance.",
    category: "Electrical Engineering",
    priceRange: { min: 50, max: 200 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Electronics",
    image: "/assets/electronics.png",
    description:
      "Electronics Services include the design, repair, and maintenance of electronic devices and systems.",
    category: "Electronics",
    priceRange: { min: 40, max: 180 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Coffee Machine Service",
    image: "/assets/Coffee.png",
    description:
      "Includes cleaning, repair, and maintenance to ensure smooth and efficient machine performance.",
    category: "Coffee Machine Service",
    priceRange: { min: 30, max: 120 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Gym Equipment Repair",
    image: "/assets/fitnessLogo.png",
    description:
      "Diagnosing, fixing, and maintaining fitness machines to ensure safe and optimal performance.",
    category: "Gym Equipment Repair",
    priceRange: { min: 60, max: 250 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Catering Equipment Service",
    image: "/assets/catering.png",
    description:
      "Catering equipment maintenance, inspection, and service for efficient food operations.",
    category: "Catering Equipment Service",
    priceRange: { min: 70, max: 300 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Medical Equipment Service",
    image: "/assets/medical.png",
    description:
      "Maintenance and repair of critical medical tools and electronic devices.",
    category: "Medical Equipment Service",
    priceRange: { min: 80, max: 350 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Electromechanical",
    image: "/assets/electromechanical.png",
    description:
      "Repair and servicing of electromechanical systems including automation tools.",
    category: "Electromechanical",
    priceRange: { min: 75, max: 300 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Clocks",
    image: "/assets/clock.webp",
    description: "Repair and restoration of analog and digital timepieces.",
    category: "Clocks",
    priceRange: { min: 25, max: 150 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Network Service",
    image: "/assets/network.png",
    description: "Setup, maintenance, and diagnostics of home/office networks.",
    category: "Network Service",
    priceRange: { min: 55, max: 220 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  },
  {
    title: "Smart Home System",
    image: "/assets/SmartHome.png",
    description: "Service and maintenance for smart home automation systems.",
    category: "Smart Home System",
    priceRange: { min: 100, max: 400 },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: true, sunday: false
    },
    isActive: true
  }
];

const categories = [
  {
    name: 'Coffee Machine Parts',
    subcategories: [
      { name: 'Grinders', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80', price: 120 },
      { name: 'Boilers', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', price: 200 },
      { name: 'Group Heads', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80', price: 80 },
      { name: 'Steam Wands', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', price: 60 },
      { name: 'Portafilters', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80', price: 45 }
    ],
    icon: '☕'
  },
  {
    name: 'Catering Parts',
    subcategories: [
      { name: 'Ovens', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80', price: 300 },
      { name: 'Dishwashers', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', price: 250 },
      { name: 'Fryers', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80', price: 180 },
      { name: 'Mixers', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', price: 150 },
      { name: 'Blenders', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', price: 90 }
    ],
    icon: '🍳'
  },
  {
    name: 'HiFi Parts',
    subcategories: [
      { name: 'Speakers', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', price: 220 },
      { name: 'Amplifiers', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', price: 180 },
      { name: 'Cables', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', price: 30 },
      { name: 'Turntables', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', price: 350 },
      { name: 'Headphones', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', price: 120 }
    ],
    icon: '🎵'
  }
];

const descriptions = {
  Grinders: 'High-quality coffee grinders for consistent grind and flavor.',
  Boilers: 'Durable boilers for espresso and coffee machines.',
  'Group Heads': 'Precision group heads for optimal extraction.',
  'Steam Wands': 'Powerful steam wands for perfect milk frothing.',
  Portafilters: 'Robust portafilters for professional baristas.',
  Ovens: 'Reliable oven parts for commercial kitchens.',
  Dishwashers: 'Efficient dishwasher parts for fast cleaning.',
  Fryers: 'Heavy-duty fryer parts for crispy results.',
  Mixers: 'Mixer parts for smooth and efficient operation.',
  Blenders: 'Blender parts for powerful blending.',
  Speakers: 'High-fidelity speakers for immersive sound.',
  Amplifiers: 'Powerful amplifiers for clear audio.',
  Cables: 'Premium cables for noise-free connections.',
  Turntables: 'Precision turntables for vinyl lovers.',
  Headphones: 'Comfortable headphones with superior sound.'
};

(async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/syntrad', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connected');

    // --- Add Services ---
    await Service.deleteMany({});
    console.log('🧹 Cleared existing services');
    await Service.insertMany(services);
    console.log('✅ All services added successfully');

    // --- Add Products ---
    const products = [];
    for (const cat of categories) {
      for (const sub of cat.subcategories) {
        products.push({
          name: `${sub.name} (${cat.name})`,
          description: descriptions[sub.name] || `${sub.name} for ${cat.name}`,
          price: sub.price,
          image: sub.image,
          category: cat.name,
          subcategory: sub.name,
          stock: 10
        });
      }
    }
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ All products added successfully');

    // --- Add Dummy Orders ---
    const allProducts = await Product.find();
    const admin = await User.findOne({ role: 'admin' });
    const user = await User.findOne({ role: 'user' });
    if (!allProducts.length || !admin || !user) {
      console.log('No products or users found. Please ensure products and users exist.');
      return;
    }
    await Order.deleteMany({});
    const orders = [
      {
        user: user._id,
        items: [
          { product: allProducts[0]._id, quantity: 2, price: allProducts[0].price },
          { product: allProducts[1]._id, quantity: 1, price: allProducts[1].price }
        ],
        shippingAddress: {
          firstName: 'John', lastName: 'Doe', address: '123 Main St', city: 'London', postCode: 'WC2A 2JR', country: 'UK', phone: '07123456789', email: 'john@example.com'
        },
        totalAmount: allProducts[0].price * 2 + allProducts[1].price,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'card',
        orderNumber: `ORD-DUMMY-1`
      },
      {
        user: user._id,
        items: [
          { product: allProducts[2]._id, quantity: 1, price: allProducts[2].price }
        ],
        shippingAddress: {
          firstName: 'Alice', lastName: 'Smith', address: '456 Queen St', city: 'Manchester', postCode: 'M1 1AE', country: 'UK', phone: '07234567890', email: 'alice@example.com'
        },
        totalAmount: allProducts[2].price,
        status: 'processing',
        paymentStatus: 'completed',
        paymentMethod: 'paypal',
        orderNumber: `ORD-DUMMY-2`
      },
      {
        user: user._id,
        items: [
          { product: allProducts[3]._id, quantity: 3, price: allProducts[3].price }
        ],
        shippingAddress: {
          firstName: 'Bob', lastName: 'Brown', address: '789 King St', city: 'Birmingham', postCode: 'B1 1AA', country: 'UK', phone: '07345678901', email: 'bob@example.com'
        },
        totalAmount: allProducts[3].price * 3,
        status: 'delivered',
        paymentStatus: 'completed',
        paymentMethod: 'card',
        orderNumber: `ORD-DUMMY-3`
      },
      {
        user: user._id,
        items: [
          { product: allProducts[4]._id, quantity: 1, price: allProducts[4].price }
        ],
        shippingAddress: {
          firstName: 'Eve', lastName: 'White', address: '101 Prince St', city: 'Liverpool', postCode: 'L1 1AA', country: 'UK', phone: '07456789012', email: 'eve@example.com'
        },
        totalAmount: allProducts[4].price,
        status: 'cancelled',
        paymentStatus: 'refunded',
        paymentMethod: 'paypal',
        orderNumber: `ORD-DUMMY-4`
      }
    ];
    await Order.insertMany(orders);
    console.log('✅ Dummy orders added successfully');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 MongoDB disconnected');
  }
})();