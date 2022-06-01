import { db } from "../configs/index.js";

export const logAdventure = async (req, adventure) => {
    const query = `INSERT INTO USERLOGS 
        VALUES(${req.user.id}, ${getTag(adventure.tags)}, ${adventure.location.x + ', ' + adventure.location.y})`;
    await db.query(query);
}

const getTag = (tags) => {
    const tagList = new Set('water', 'land', 'air');
    return tags.find((tag) => {
        if (tagList.has(tag))
            return true;
    });
}
