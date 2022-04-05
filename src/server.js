import db from './configs/db.js'
import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import passport from 'passport'
import cors from 'cors'
import cookieSession from 'cookie-session'
import './auth/passport.js'

import userRoutes from './routes/user.routes.js'
import adventureRoutes from './routes/adventure.routes.js'
import reviewRoutes from './routes/review.routes.js'
import reservationRoutes from './routes/reservation.routes.js'

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
app.use('/api/reservation', reservationRoutes)
app.use('/api/review', reviewRoutes)

//Test Route
app.get('/', (req, res, ) => {
    res.json('Adventuresy API running...')
})

const PORT = process.env.PORT || 80


app.listen(PORT, () => {
    console.log(chalk.blueBright(`Server running on PORT ${PORT}`));
})