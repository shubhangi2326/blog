import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();
connectDB();

const app = express();

// INCREASE LIMIT HERE (Set to 50mb or higher depending on your image sizes)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Routes
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
    res.send("Blog System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));