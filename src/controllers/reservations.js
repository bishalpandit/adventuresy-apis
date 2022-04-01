import db from "../configs/db.js";

export const createReservation = async (req, res) => {

    try {
        const { partadven_id, total, persons, start_date, end_date, price, tax } = req.body;

        const errors = [];

        !partadven_id && errors.push('Partner Adventure link id is required');
        !total && errors.push('Total amount is required');
        !persons && errors.push('No. of persons is required');
        !start_date && errors.push('Start date is required');
        !end_date && errors.push('End date is required');
        !price && errors.push('Price is required');
        !tax && errors.push('Tax is required');

        if(errors.length > 0) {
            res.status(400);
            throw new Error(errors.join(', '));
        }

        const query = `INSERT INTO reservations 
        VALUES(${user_id}, ${start_date}, ${end_date}, ${persons}, ${total}, ${price}, ${tax}, ${partadven_id}))`;

        const reservation = db.query(query);

        if (!reservation.rowCount) {
            res.status(404).json({
                msg: 'Review not created',
                status: false
            })
        }

        res.status(201).json({
            data: reservation.rows[0],
            status: true
        })
        
    } catch (error) {

        res.status(400).json({
            status: false,
            error: error
        })
    }


}