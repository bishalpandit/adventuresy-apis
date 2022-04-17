import fs from 'fs'
import path from 'path'

const streamSplashVideo = (req, res) => {

    try {
        const __dirname = path.resolve();
        const pathi = path.join(__dirname, '../src/assets/Adventuresy_Splash.mp4');
        const stat = fs.statSync(pathi)
        const fileSize = stat.size
        const range = req.headers.range;

        console.info(fileSize);

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1

            const chunksize = (end - start) + 1
            const file = fs.createReadStream(pathi, { start, end })
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head)
            file.pipe(res)
        }

        else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(pathi).pipe(res)
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            error: error
        })
    }
}

export { streamSplashVideo };