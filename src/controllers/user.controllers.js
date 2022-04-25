import { db } from '../configs/index.js'


export const getUser = async (req, res) => {
    try {
        const getUserQ = `
        SELECT first_name, last_name, email_id, mobile 
        FROM users
        WHERE id = $1`;

        const users = await db.query(getUserQ, [req.params.id]);

        res.status(200)
            .json(users.rows[0]);
    }
    catch (err) {
        res.status(400)
            .json({
                error: err.stack,
                status: false
            })
    }
}



export const updateUser = async (req, res) => {

    try {
        const { f_name, l_name, email, password, mobile } = req.body;

        const getUserQ = `
        SELECT * 
        FROM USERS 
        WHERE id = $1 
        `;

        const { rows } = await db.query(getUserQ, [req.params.id]);

        const updateQ = {
            text: `UPDATE USERS 
            SET first_name = $1, last_name = $2, password = $3, mobile = $4 
            WHERE ID = $5`,
            values: [f_name || rows[0].first_name, l_name || rows[0].last_name,
            password || rows[0].password, mobile || rows[0].mobile, req.params.id]
        };

        const updatedUser = await db.query(updateQ);

        if (updatedUser) {
            res.send({
                status: true,
                message: 'User Updated!'
            })
        }
        else {
            res.send({
                status: false,
                message: 'User was not Updated'
            })
        }
    }

    catch (err) {
        res.status(400)
            .json({
                error: err.stack,
                status: false
            })
    }
}

