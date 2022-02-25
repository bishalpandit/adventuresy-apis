import db from "../configs/db";

export const getAdventures = (req, res) => {
    const query = req.query
    const { ctype, limit } = query

    let adventures;

    try {

        if (ctype) {

            switch (ctype) {
                // max reservations
                case 'popular':
                    adventures = await db.query(`SELECT A.title, A.type, A.summary, A.price FROM ADVENTURES A JOIN RESERVATIONS R ON A.id = R.adventure_id GROUP BY adventure_id ORDER BY COUNT(*) DESC LIMIT ${limit ? limit * 5 : 5}`)
                    break
                // most booked last 2 months
                case 'trending':
                    break
                // recently added
                case 'recent':
                    break
                // high ratings
                case 'recommended':

            }
        }

        else {
            // get all...
            if(limit)
                adventures = await db.query(`SELECT title, type, summary, price FROM ADVENTURES LIMIT ${limit}`)
            else
                adventures = await db.query('SELECT title, type, summary, price FROM ADVENTURES')
        }

        if (adventures.rowCount) {
            res.status(200).json({
                data: adventures.rows,
                status: true
            })
        }

    } catch (error) {

        res.status(400).json({
            status: false,
            error: error
        })
    }


}
/*
popular, trending, recent, limit

*/