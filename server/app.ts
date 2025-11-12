import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import hockeyRouter from "./routes/hockeyRoutes.js";
import basketballRouter from "./routes/basketballRoutes.js"

const app = express()

// Enable CORS for all routes
app.use(cors());

if (process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/hockey', hockeyRouter)
app.use('/api/basketball', basketballRouter)

export default app;