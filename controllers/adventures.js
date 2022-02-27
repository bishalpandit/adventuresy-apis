import db from "../configs/db.js";

export const getAdventures = async (req, res) => {

    const query = req.query
    console.log(query);
    const { ctype, limit } = query

    let adventures;

    try {

        if (ctype) {
            const selectQuery = {
                popular: 'SELECT A.title, A.type, A.summary, A.price FROM ADVENTURES A JOIN RESERVATIONS R ON A.id = R.adventure_id GROUP BY A.id ORDER BY COUNT(*) DESC LIMIT 5'
            }

            switch (ctype) {
                // max reservations

                case 'popular':
                    adventures = await db.query(selectQuery.popular)
                    break
                // most booked last 2 months
                case 'trending':
                    break
                // recently added
                case 'recent':
                    break
                // high ratings
                case 'recommended':
                    break
                default:
            }
        }

        else {
            // get all...
            if (limit)
                adventures = await db.query(`SELECT title, type, summary, price FROM ADVENTURES LIMIT ${limit}`)
            else
                adventures = await db.query('SELECT title, type, summary, price FROM ADVENTURES')
        }


        res.status(200).json({
            data: adventures.rows,
            status: true
        })


    } catch (error) {

        res.status(400).json({
            status: false,
            error: error
        })
    }


}

export const getAdventureById = async (req, res) => {

    try {
        const ID = req.params.id;

        const adventure = await db.query('SELECT * FROM ADVENTURES WHERE ID = $1', [ID])

        if (adventure.rowCount) {
            res.status(200).json({
                data: adventure.rows[0],
                status: true
            })
        }
        else {
            res.status(404).json({
                msg: 'not found',
                status: false
            })
        }

    } catch (error) {

        res.status(400).json({
            error: error,
            status: false
        })
    }

}

export const getAdventuresByCategory = async (req, res) => {

    try {
        const query = req.query.c1;

        let categories = '('

        const queryArr = query.split(',')

        for(let i=0; i<queryArr.length; i++) {
            categories += "\'" +  queryArr[i] + "\'"
            if(i != queryArr.length-1)
                categories += ", "
        }

        categories += ')'

        const adventure = await db.query(`SELECT * FROM ADVENTURES WHERE type IN ${categories}`)

        if (adventure.rowCount) {
            res.status(200).json({
                data: adventure.rows,
                status: true
            })
        }
        else {
            res.status(404).json({
                msg: 'not found',
                status: false
            })
        }

    } catch (error) {

        res.status(400).json({
            error: error,
            status: false
        })
    }

}

export const getAdventuresBySearch = async (req, res) => {

    try {
        const query = req.query

        const searchQuery = {
            address: "\'%" + query?.loc + "%\'",
            category: "\'%" + query?.cat + "%\'",
            partner: "\'%" + query?.part + "%\'"
        }
        // TODO: Partner Query
        const adventure = await db.query(`SELECT * FROM ADVENTURES WHERE ADDRESS ILIKE ${searchQuery.address} OR TYPE ILIKE ${searchQuery.category}`)

        if (adventure.rowCount) {
            res.status(200).json({
                data: adventure.rows,
                status: true
            })
        }
        else {
            res.status(404).json({
                msg: 'not found',
                status: false
            })
        }

    } catch (error) {

        res.status(400).json({
            error: error,
            status: false,
            msg: "No Adventures Found! Search Failed!"
        })
    }

}