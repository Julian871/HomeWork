import express, {Request, Response} from 'express';

export const app = express()

app.use(express.json())

enum AvailableResolutions {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
}

// create type for database
type VideoType = {
    "id": number,
    "title": string,
    "author": string,
    "canBeDownloaded": boolean,
    "minAgeRestriction": number | null,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": AvailableResolutions[]
}

// create local database
const videoDb: VideoType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-08-17T18:06:43.264Z",
        publicationDate: "2023-08-17T18:06:43.264Z",
        availableResolutions: [
            AvailableResolutions.P144
        ]
    }
]

app.get('/', (req: Request, res:Response) => {
    res.send('Zero page')
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videoDb)
})