import { db } from "../configs/index.js";

export const logAdventure = async (req, adventure) => {
    console.log(req.user);
    const location = adventure.location.x + "," + adventure.location.y;
    const tag = getTag(adventure.tags);
    const query = `INSERT INTO 
        USERLOGS(user_id, tag_name, location) 
        VALUES(${"'" + req.user.id + "'"}, ${"'" + tag + "'"}, ${"'" + location + "'"})`;
    await db.query(query);
}

const getTag = (tags) => {
    return tags.find((tag) => {
        return tag == "air" ||
           tag == "land" ||
           tag == "water";
    })
}