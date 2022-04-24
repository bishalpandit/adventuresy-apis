import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import chalk from 'chalk'
import passport from 'passport'
import cors from 'cors'
import cookieSession from 'cookie-session'
import './auth/passport.js'
import { connectDB, PORT } from './configs/index.js'
import apiRoutes from './routes/index.js'
import createSockerServer from './services/socket/socketServer.js'


const app = express();
const httpServer = new http.Server(app);

dotenv.config();

// Google Authentication Middlewares
app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

createSockerServer(httpServer);

app.use(express.json());

//CORS
app.use(cors({
    origin: '*'
}))

//Connect to DB
connectDB();

app.use('/api', apiRoutes);

//Test Route
app.get('/', (req, res,) => {
    res.json('Adventuresy API running...')
})


httpServer.listen(PORT, () => {
    console.log(chalk.blueBright(`Server running on PORT ${PORT}`));
})

