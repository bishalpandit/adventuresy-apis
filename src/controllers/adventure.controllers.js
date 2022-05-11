import { db } from "../configs/index.js";

export const getAdventures = async (req, res) => {
    try {
        let { collections, limit } = req.query;
        collections = (typeof collections !== "object") ? [collections] : collections;
        let adventures = {};

        const collectionMap = new Map([
            [
                "popular",
                `SELECT A.title, A.type, A.summary, A.img_link 
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
                `SELECT title, type, summary, img_link
                    FROM ADVENTURES 
                    ORDER BY created_at DESC 
                    LIMIT ${limit ? limit : "NULL"};`,
            ],

            [
                "trending",
                `SELECT adventure_id, 
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
                `SELECT title, type, summary 
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
        const partnerID = req.query;
        let adventure;

        if (partnerID) {
            adventure = await db.query(
                "SELECT * FROM PARTNERADVENTURELINK WHERE PARTNER_ID = $1",
                [partnerID]
            );
        } else {
            adventure = await db.query("SELECT * FROM ADVENTURES WHERE ID = $1", [
                adventureID,
            ]);
        }

        if (adventure.rowCount) {
            res.status(200).json({
                data: adventure.rows[0],
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
            address: "'%" + query?.loc + "%'",
            category: "'%" + query?.cat + "%'",
            partner: "'%" + query?.part + "%'",
        };

        const adventure = await db.query(`SELECT * 
        FROM ADVENTURES A
        JOIN PARTNERADVENTURELINK PAL
        ON A.id = PAL.adventure_id
        JOIN PARTNERS P
        ON PAL.partner_id = P.id
        WHERE A.address ILIKE ${searchQuery.address} 
        OR A.type ILIKE ${searchQuery.category}
        OR P.pname ILIKE ${searchQuery.partner}
        `);

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
        const nargs = Object.keys(query).length;

        console.log(query);

        const getOp = (queryItem) => {
            switch (queryItem) {
                case "maxprice":
                    return "<=";
                case "minprice":
                    return ">=";
                case "type":
                    return "=";
                case "address":
                    return "ILIKE";
                case "pname":
                    return "ILIKE";
                default:
                    return "=";
            }
        };

        const filterQuery = Object.entries(query)
            .map(
                (item) => `${item[0] == "maxprice" || item[0] == "minprice" ? "price" : item[0]
                    }  ${getOp(item[0] + "")}
                ${typeof item[1] == "string"
                        ? `'${item[0] == "address" ? "%" + item[1] + "%" : item[1]
                        }'`
                        : Number(item[1])
                    }`
            )
            .reduce((prev, cur, idx) => {
                if (idx == nargs - 1) return prev + cur;
                else return prev + cur + " AND ";
            }, "");

        const dbQuery = `SELECT * from adventureprices ap 
        JOIN partneradventurelink pal ON pal.id = ap.partneradventurelink_id
        JOIN partners p ON pal.partner_id = p.id
        JOIN adventures a ON pal.adventure_id = a.id where ${filterQuery}`;

        const adventures = await db.query(dbQuery);

        if (adventures.rowCount) {
            res.status(200).json({
                data: adventures.rows,
                status: true,
            });
        } else {
            res.status(404).json({
                msg: "nothing found",
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

/*

adventures -> name, img, price-range, partners[0,1,2], location
*/
