import { db } from "../configs/index.js";
import { logAdventure } from "../services/tracker.js";

export const getAdventures = async (req, res) => {
    try {
        let { collections, limit } = req.query;
        collections = (typeof collections !== "object") ? [collections] : collections;
        let adventures = {};

        const collectionMap = new Map([
            [
                "popular",
                `SELECT A.id, A.title, A.type, A.summary, A.img_link 
                    FROM ADVENTURES A
                    JOIN PARTNERADVENTURELINK PA
                    ON A.id = PA.adventure_id
                    JOIN RESERVATIONS R
                    ON R.partneradventurelink_id = PA.id
                    GROUP BY A.id 
                    ORDER BY COUNT(*) DESC 
                    LIMIT ${limit ? limit : "NULL"};`,
            ],

            [
                "recent",
                `SELECT id, title, type, summary, img_link
                    FROM ADVENTURES 
                    ORDER BY created_at DESC 
                    LIMIT ${limit ? limit : "NULL"};`,
            ],

            [
                "trending",
                `SELECT adventure_id as id, 
                    (SELECT title FROM ADVENTURES A WHERE A.id = adventure_id ), 
                    (SELECT summary FROM ADVENTURES A WHERE A.id = adventure_id ), 
                    (SELECT img_link FROM ADVENTURES A WHERE A.id = adventure_id ) 
                    FROM REVIEWS REV 
                    JOIN RESERVATIONS RES
                    ON REV.reservation_id = RES.id 
                    JOIN PARTNERADVENTURELINK PA 
                    ON RES.partneradventurelink_id = PA.id 
                    JOIN ADVENTURES ADV 
                    ON PA.adventure_id = ADV.id 
                    GROUP BY adventure_id
                    ORDER BY AVG(rating) DESC
                    LIMIT ${limit ? limit : "NULL"};`,
            ],
            [
                "all",
                `SELECT id, title, type, summary 
                FROM ADVENTURES 
                LIMIT ${limit ? limit : "NULL"};`
            ]
        ]);

        const q = new Map();

        if (collections)
            collections.map((collection) => {
                if (collectionMap.has(collection)) {
                    q.set(collection, collectionMap.get(collection));
                }
            });

        if (q.size) {
            for (const collection of q.entries()) {
                adventures[collection[0]]
                    = (await db.query(collection[1])).rows;
            }
        }
        else {
            adventures["all"] = await db
                .query(collectionMap.get("all"));
        }

        res.json({
            data: adventures,
            status: true,
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            error: error,
        });
    }
};

export const getAdventureById = async (req, res) => {
    try {
        const adventureID = req.params.id;
        let data = {};

        let adventure = await db.query(
            `SELECT *
             FROM ADVENTURES
             WHERE id = ${"'" + adventureID + "'"};
            `)

        console.log(adventure.rows[0]);

        if (!adventure.rows) {
            res.json({
                message: "Not found",
                status: false
            });
        }

        let rating = await db.query(
            `SELECT avg(rating)
            FROM REVIEWS REV 
            JOIN RESERVATIONS RES 
            ON REV.reservation_id = RES.id
            JOIN PARTNERADVENTURELINK PA 
            ON RES.partneradventurelink_id = PA.id
            WHERE PA.adventure_id = ${"'" + adventureID + "'"}
            `
        );

        let partners = await db.query(
            `SELECT partner_id, price,
            (SELECT pname 
            FROM PARTNERS
            WHERE id = partner_id),
            avail_dates
            FROM PARTNERADVENTURELINK PA
            LEFT JOIN BOOKINGAVAILABILITY BA
            ON PA.id = BA.partneradventurelink_id
            WHERE PA.adventure_id = ${"'" + adventureID + "'"};
            `
        );

        data.adventure = adventure.rows[0];
        data.partners = partners.rows;
        data.rating = rating.rows[0];

        res.json({
            data: data,
            status: true
        });

        // logAdventure(req, data.adventure);
    } catch (error) {
        res.status(400).json({
            error: error,
            status: false,
        });
    }
};

export const getAdventuresByCategory = async (req, res) => {
    try {
        const query = req.query.cat;

        let categories = "(";

        const queryArr = query.split(",");

        for (let i = 0; i < queryArr.length; i++) {
            categories += "'" + queryArr[i] + "'";
            if (i != queryArr.length - 1) categories += ", ";
        }

        categories += ")";

        const adventure = await db.query(`SELECT * 
        FROM ADVENTURES 
        WHERE type IN ${categories}`);

        if (adventure.rowCount) {
            res.status(200).json({
                data: adventure.rows,
                status: true,
            });
        } else {
            res.status(404).json({
                msg: "not found",
                status: false,
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error,
            status: false,
        });
    }
};

export const getAdventuresBySearch = async (req, res) => {
    try {
        const query = req.query;

        const searchQuery = {
            address: "'%" + query.location + "%'",
            category: "'%" + query.activity + "%'",
            partner: "'%" + query.partner + "%'",
        };

        const adventures = await db.query(`
        SELECT 
        id, type, title, summary, address, img_link, tags
        FROM ADVENTURES A
        WHERE A.address ILIKE ${searchQuery.address} 
        INTERSECT
        SELECT 
        id, type, title, summary, address, img_link, tags
        FROM ADVENTURES A
        WHERE A.type ILIKE ${searchQuery.category}
        INTERSECT
        SELECT id, type, title, summary, address, img_link, tags
        FROM ADVENTURES A
        WHERE id in (
        SELECT adventure_id
        FROM PARTNERADVENTURELINK PAL
        WHERE partner_id in (
        SELECT id
        FROM PARTNERS P
        WHERE P.pname ILIKE ${searchQuery.partner}
        ))
        `);

        if (!adventures.rowCount) {
            throw new Error('No data');
        }

        res.status(200).json({
            data: adventures.rows,
            status: true,
        });

    } catch (error) {
        res.status(400).json({
            error: error,
            status: false,
            msg: "No Adventures Found! Search Failed!",
        });
    }
};

export const getAvailableDates = async (req, res) => {
    try {
        const partnerId = req.params.pid;
        const adventureId = req.params.aid;

        const availDates = await db.query(`SELECT AVAIL_DATES
         FROM BOOKINGAVAILABILITY BA
         JOIN PARTNERADVENTURELINK PAL ON BA.partneradventurelink_id = PAL.id
         WHERE BA.partneradventurelink_id = 
         (SELECT id FROM PARTNERADVENTURELINK
         WHERE partner_id = ${"'" + partnerId + "'"} 
         AND adventure_id = ${"'" + adventureId + "'"}
         )
        `);

        if (availDates.rowCount) {
            res.status(200).json({
                data: availDates.rows[0]?.avail_dates,
                status: true,
            });
        } else {
            res.status(404).json({
                msg: "not found",
                status: false,
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error,
            status: false,
            msg: "No dates found! Something went wrong!",
        });
    }
};

export const getAdventuresByFilter = async (req, res) => {
    try {
        const query = req.query;

        const filterQuery = {};

        Object.entries(query)
            .map(([key, filters], index) => {
                const query = filters
                    .map((item, idx) => {
                        if (idx != filters.length - 1)
                            return `${key} ILIKE '%${item}%' OR `;
                        else
                            return `${key} ILIKE '%${item}%'`;
                    })
                    .join(" ");

                filterQuery[key] = query;
            });


        const adventures = await db.query(`
        SELECT 
        id, type, title, summary, address, img_link, tags
        FROM ADVENTURES 
        ${filterQuery?.address === undefined ? '' : `WHERE ${filterQuery.address}`} 
        INTERSECT
        SELECT 
        id, type, title, summary, address, img_link, tags
        FROM ADVENTURES A
        ${filterQuery?.type === undefined ? '' : `WHERE ${filterQuery.type}`}
        INTERSECT
        SELECT id, type, title, summary, address, img_link, tags
        FROM ADVENTURES A
        WHERE id in (
        SELECT adventure_id
        FROM PARTNERADVENTURELINK PAL
        WHERE partner_id in (
        SELECT id
        FROM PARTNERS P
        ${filterQuery?.pname === undefined ? '' : `WHERE ${filterQuery.pname}`}
        ))
        `);

        if (!adventures.rowCount) {
            throw new Error('No data');
        }

        res.status(200).json({
            data: adventures.rows,
            status: true,
        });

    } catch (error) {
        res.status(400).json({
            error: error,
            status: false,
        });
    }
};
