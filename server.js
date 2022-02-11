import db from './configs/db.js'
import express from 'express'
import dotenv from 'dotenv'

const app = express()

// Configs
dotenv.config()
app.use(express.json())

//Connect to Postgres DB
db.connect().then((err, res) => {
    if(err) {
        console.log(err);
    }

    console.log('Connected to Database');
})


const PORT = process.env.PORT || 5000

app.listen(5000, () => {
    console.log(`Server running on PORT ${PORT}`);
})