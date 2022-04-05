import db from "../configs/db.js";

export const createReview = async (req, res) => {

    try {
        let { reservation_id, content, rating, istripover, image_links } = req.body;

        const errors = [];

        if (!istripover) {
            res.status(400);
            throw new Error('Give review after your trip');
        }

        !reservation_id && errors.push('Reservations id is required');
        !content && errors.push('Content is required');
        !rating && errors.push('Rating is required');

        if(errors.length > 0) {
            res.status(400);
            throw new Error(errors.join(', '));
        }

        image_links = (!image_links) ? [] : image_links;

        const reviewQ =
            `INSERT INTO REVIEWS(reservation_id, content, rating, image_links) 
            VALUES(${reservation_id}, ${content}, ${rating}, ${image_links})`;

        const review = db.query(reviewQ);

        if (!review.rowCount) {
            res.status(404).json({
                msg: 'Review not created',
                status: false
            })
        }

        res.status(201).json({
            data: review.rows[0],
            status: true
        })

    } catch (error) {

        res.json({
            status: false,
            error: error
        })
    }


}