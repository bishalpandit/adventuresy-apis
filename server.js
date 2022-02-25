import db from './configs/db.js'
import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import passport from 'passport'
import cors from 'cors'
import cookieSession from 'cookie-session'
import './auth/passport.js'

import userRoutes from './routes/users.js'
import adventureRoutes from './routes/adventures.js'

const app = express()

// Configs
dotenv.config()
app.use(express.json())

//CORS
app.use(cors({
    origin: '*'
}))

// Google Authentication Middlewares
app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());


//Connect to Postgres DB
db.connect((err) => {
    if (err)
        console.log(err);
    else
        console.log(chalk.yellowBright('Connected to PostgreSQL'));
})


// Routes
app.use('/api/users', userRoutes)
app.use('/api/adventures', adventureRoutes)

//Test Route
app.get('/', (req, res, ) => {
    res.json(req.profile)
})

const PORT = process.env.PORT || 5000

app.listen(5000, () => {
    console.log(chalk.blueBright(`Server running on PORT ${PORT}`));
})