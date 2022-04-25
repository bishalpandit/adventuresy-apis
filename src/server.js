import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import chalk from 'chalk'
import passport from 'passport'
import cors from 'cors'
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'
import './auth/passport.js'
import { connectDB, PORT, COOKIE_SECRET } from './configs/index.js'
import apiRoutes from './routes/index.js'
import createSockerServer from './services/socket/socketServer.js'


const app = express();
const httpServer = new http.Server(app);

dotenv.config();

app.use(cors({
    origin: ['http://localhost:3000', 'https://adventuresy.vercel.app', 'https://adventuresy-bishalpandit.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cookieSession({
    keys: [COOKIE_SECRET],
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: true,
}))

app.use(passport.initialize());
app.use(passport.session());

createSockerServer(httpServer);

connectDB();

app.use('/api', apiRoutes);

app.get('/', (req, res,) => {
    console.log(req.session);
    res.json('Welcome to Adventuresy 🦄🌈✨👋🌎🌍🌏✨🌈🦄')
})

httpServer.listen(PORT, () => {
    console.log(chalk.blueBright(`Server running on PORT ${PORT}`));
})

