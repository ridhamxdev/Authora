
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const products = [
    {
        name: 'Airpods Wireless Bluetooth Headphones',
        image: '/images/airpods.jpg',
        description:
            'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
        brand: 'Apple',
        category: 'Electronics',
        price: 89.99,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'iPhone 13 Pro 256GB Memory',
        image: '/images/phone.jpg',
        description:
            'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
        brand: 'Apple',
        category: 'Electronics',
        price: 599.99,
        countInStock: 7,
        rating: 4.0,
        numReviews: 8,
    },
    {
        name: 'Cannon EOS 80D DSLR Camera',
        image: '/images/camera.jpg',
        description:
            'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
        brand: 'Cannon',
        category: 'Electronics',
        price: 929.99,
        countInStock: 5,
        rating: 3,
        numReviews: 12,
    },
    {
        name: 'Sony Playstation 4 Pro White Version',
        image: '/images/playstation.jpg',
        description:
            'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
        brand: 'Sony',
        category: 'Electronics',
        price: 399.99,
        countInStock: 11,
        rating: 5,
        numReviews: 12,
    },
    {
        name: 'Logitech G-Series Gaming Mouse',
        image: '/images/mouse.jpg',
        description:
            'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
        brand: 'Logitech',
        category: 'Electronics',
        price: 49.99,
        countInStock: 7,
        rating: 3.5,
        numReviews: 10,
    },
    {
        name: 'Amazon Echo Dot 3rd Generation',
        image: '/images/alexa.jpg',
        description:
            'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
        brand: 'Amazon',
        category: 'Electronics',
        price: 29.99,
        countInStock: 0,
        rating: 4,
        numReviews: 12,
    },
];

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();

    // Simple schema definition for seeding without full NestJS context
    const productSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for now or fetch admin user
        name: { type: String, required: true },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
        price: { type: Number, required: true, default: 0 },
        countInStock: { type: Number, required: true, default: 0 },
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ name: String })); // Minimal User model

    try {
        await Product.deleteMany();

        // Ensure at least one user exists to assign products to
        // const adminUser = await User.findOne(); 

        const sampleProducts = products.map((product) => {
            return { ...product, user: new mongoose.Types.ObjectId() }; // Mock user ID for now
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
