import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE!?.replace("<PASSWORD>",process.env.DATABASE_PASSWORD!);

if (DB) {
    mongoose.connect(DB)
        .then(() => console.log('DB connection successful'))
        .catch((err) => {
            console.error('DB connection error:', err.message);
            console.log('Server will continue without database connection');
        });
} else {
    console.log('No DATABASE connection string found in environment variables');
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
