import db from '../configs/db.js'
import bcrypt from 'bcrypt'
import { row } from 'mathjs';


export const getUserByID = async (req, res) => {

    try {
        const users = await db.query('SELECT * FROM USERS WHERE ID = $1', [req.params.id])
        res.status(200).json(users?.rows);
    }

    catch (err) {
        console.log(err.stack);
        res.status(400).send(err.stack)
    }
}

export const registerUser = async (req, res) => {

    try {
        const userExists = await db.query('SELECT ID FROM USERS WHERE EMAIL_ID = $1', [req.body.email])

        console.log(userExists);
        if (userExists.rowCount) {
            res.status(400).send('User Already Exists!')
        }

        const { f_name, l_name, email, password, mobile } = req.body

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const Insertquery = {
            text: 'INSERT INTO users(first_name, last_name, email_id, password, mobile) VALUES($1, $2, $3, $4, $5)',
            values: [f_name, l_name, email, hashedPassword, mobile],
        }
        const userRecord = await db.query(Insertquery)

        if (userRecord) {
            res.status(201).json(userRecord)
        }
        else {
            res.status(400).send('Something went wrong!')
        }
    }

    catch (err) {
        console.log(err.stack);
        res.status(400).send(err.stack)
    }
}

export const loginUser = async (req, res) => {

    try {
        const userExists = await db.query('SELECT ID FROM USERS WHERE EMAIL_ID = $1', [req.body.email])

        if (!userExists.rowCount) {
            res.status(400).send('User Doesn\'t Exist. Sign Up!')
        } 
        
        const userQuery = {
            text: 'SELECT * FROM USERS WHERE EMAIL_ID = $1',
            values: [req.body.email]
        }

        const userRecord = await db.query(userQuery)

        //Matching entered and stored passwords
        //console.log(userRecord.rows[0].password);
        const match = await bcrypt.compare(req.body.password, userRecord.rows[0].password)

        if(match) {
            res.status(200).json({
                ...userRecord.rows[0],
                token: 'heyimtoken'
            })
        }
        else {
            res.status(401).send('Wrong Password!')
        }
       
    }

    catch (err) {
        console.log(err.stack);
        res.status(400).send(err.stack)
    }
}

export const updateUser = async (req, res) => {

    try {
        const { f_name, l_name, email, password, mobile} = req.body

        const { rows } = await db.query('SELECT * FROM USERS WHERE ID = $1 ', [req.params.id])
        
        const updateQuery = {
            text: 'UPDATE USERS SET first_name = $1, last_name = $2, password = $3, mobile = $4 WHERE ID = $5',
            values: [f_name || rows[0].first_name, l_name || rows[0].last_name, password || rows[0].password, mobile || rows[0].mobile, req.params.id]
        }

        const newUser = await db.query(updateQuery)

        if(newUser) {
            res.send({
                status: 'true',
                message: 'User Updated!'
            })
        }
        else {
            res.send({
                status: 'false',
                message: 'User was not Updated'
            })
        }
    }

    catch (err) {
        console.log(err.stack);
        res.status(400).send(err.stack)
    }
}

