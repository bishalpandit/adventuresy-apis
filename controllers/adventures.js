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
        const adventureID = req.params.id;
        const partnerID = req.query;
        let adventure

        if (partnerID) {
            adventure = await db.query('SELECT * FROM PARTNERADVENTURELINK WHERE PARTNER_ID = $1', [partnerID])
        }
        else {
            adventure = await db.query('SELECT * FROM ADVENTURES WHERE ID = $1', [adventureID])
        }

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

        for (let i = 0; i < queryArr.length; i++) {
            categories += "\'" + queryArr[i] + "\'"
            if (i != queryArr.length - 1)
                categories += ", "
        }

        categories += ')'

        const adventure = await db.query(`SELECT * 
        FROM ADVENTURES 
        WHERE type IN ${categories}`)

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
        const adventure = await db.query(`SELECT * 
        FROM ADVENTURES 
        WHERE ADDRESS ILIKE ${searchQuery.address} 
        OR TYPE ILIKE ${searchQuery.category}`)

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

export const getAvailableDates = async (req, res) => {

    try {
        const partnerId = req.params.pid
        const adventureId = req.params.aid

        const availDates = await db.query(`SELECT AVAIL_DATES
         FROM BOOKINGAVAILABILITY BA
         JOIN PARTNERS P ON BA.partner_id = P.id
         JOIN ADVENTURES A ON BA.adventure_id = A.id
         WHERE BA.partner_id = ${"\'" + partnerId + "\'"} AND BA.adventure_id = ${"\'" + adventureId + "\'"}`)

        if (availDates.rowCount) {
            res.status(200).json({
                data: availDates.rows[0]?.avail_dates,
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
            msg: "No dates found! Something went wrong!"
        })
    }

}

export const getAdventuresByFilter = async (req, res) => {

    try {
        const query = req.query
        const nargs = Object.keys(query).length

        console.log(query);

        const getOp = (queryItem) => {
            switch (queryItem) {
                case 'maxprice': return '<='
                case 'minprice': return '>='
                case 'type': return '='
                case 'address': return 'ILIKE'
                case 'pname': return 'ILIKE'
                default: return '='
            }
        }

        const filterQuery = Object.entries(query)
            .map((item) => `${(item[0] == 'maxprice' || item[0] == 'minprice') ? 'price' : item[0]}  ${getOp(item[0] + "")}
                ${(typeof (item[1]) == 'string') ? `'${(item[0] == 'address') ? ('%' + item[1] + '%') : item[1]}'` : Number(item[1])}`)
            .reduce((prev, cur, idx) => {
                if (idx == nargs - 1)
                    return prev + cur
                else
                    return prev + cur + ' AND '
            }, "")

        const dbQuery = `SELECT * from adventureprices ap 
        JOIN partneradventurelink pal ON pal.id = ap.partneradventurelink_id
        JOIN partners p ON pal.partner_id = p.id
        JOIN adventures a ON pal.adventure_id = a.id where ${filterQuery}`

        const adventures = await db.query(dbQuery);

        if (adventures.rowCount) {
            res.status(200).json({
                data: adventures.rows,
                status: true
            })
        }
        else {
            res.status(404).json({
                msg: 'nothing found',
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

/*

adventures -> name, img, price-range, partners[0,1,2], location
*/