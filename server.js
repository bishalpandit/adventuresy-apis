import db from './configs/db.js'
import express from 'express'
import dotenv from 'dotenv'

import userRoutes from './routes/users.js'

const app = express()

// Configs
dotenv.config()
app.use(express.json())

//Connect to Postgres DB
db.connect((err) => {
    if(err)
        console.log(err);
    else
        console.log('Connected to DB');
})

// Routes
app.use('/users', userRoutes)


const PORT = process.env.PORT || 5000

app.listen(5000, () => {
    console.log(`Server running on PORT ${PORT}`);
})