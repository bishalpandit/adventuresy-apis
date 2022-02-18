import db from '../configs/db.js'

/*
@desc get a user by id
@route GET api/users/:id
@access Protected
*/

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

        const {f_name, l_name, email, password, mobile } = req.body

        const Insertquery = {
            text: 'INSERT INTO users(first_name, last_name, email_id, password, mobile) VALUES($1, $2, $3, $4, $5)',
            values: [f_name, l_name, email, password, mobile],
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