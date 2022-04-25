import { db, LOGIN_URL } from '../configs/index.js'
import bcrypt from 'bcrypt'
import generateToken from '../library/utils/generateToken.js';

export const register = async (req, res) => {

    try {
        const userExists = await db.query('SELECT ID FROM USERS WHERE EMAIL_ID = $1', [req.body.email])

        console.log(userExists);
        if (userExists.rowCount) {
            res.status(400).send('User Already Exists!')
        }

        const { f_name, l_name, email, password, mobile } = req.body;

        const errors = [];

        !f_name && errors.push('First name is required');
        !l_name && errors.push('Last name is required');
        !email && errors.push('Email is required');
        !password && errors.push('Password is required');
        !mobile && errors.push('Mobile is required');

        if (errors.length > 0) {
            res.status(400);
            throw new Error(errors.join(', '));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const Insertquery = {
            text: 'INSERT INTO users(first_name, last_name, email_id, password, mobile) VALUES($1, $2, $3, $4, $5)',
            values: [f_name, l_name, email, hashedPassword, mobile],
        }
        await db.query(Insertquery);

        const userQuery = {
            text: 'SELECT first_name, last_name, email_id, mobile FROM USERS WHERE EMAIL_ID = $1',
            values: [req.body.email]
        }

        if (user) {
            const token = generateToken(user.rows[0]);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

            res.status(201).json({
                success: true
            })
        }
        else {
            res.status(400).send('Something went wrong!')
        }
    }

    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export const jwtLogin = async (req, res) => {

    try {
        const userExists = await db.query('SELECT ID FROM USERS WHERE EMAIL_ID = $1', [req.body.email])
        if (!userExists.rowCount) {
            res.status(400).send('User Doesn\'t Exist. Sign Up!')
        }

        const userQuery = {
            text: 'SELECT * FROM USERS WHERE EMAIL_ID = $1',
            values: [req.body.email]
        }

        const user = await db.query(userQuery);

        const match = await bcrypt.compare(req.body.password, user.rows[0].password)

        if (match) {
            const token = generateToken(user.rows[0]);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

            res.status(200)
                .json({
                    success: true
                });
        }
        else {
            res.status(401).send('Wrong Password!')
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

export const checkAuth = async (req, res) => {
    try {
        res.json({
            status: true,
            user: req.user
        });
    }
    catch (err) {
        res.status(400)
            .json({
                error: err?.stack,
                status: false
            })
    }
}

export const logout = async (req, res) => {
    try {
        if (Object.keys(req.session).length != 0) {
            req.logout();
            req.session = null;
            res.clearCookie('session');
            res.json({
                message: "logged out"
            })
        }
        else if (req.user) {
            req.user = null;
            res.clearCookie('jwt');
            res.json({
                message: "logged out"
            })
        }
        else {
            res.json({
                message: 'Already logged out!'
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

