import express, {Request, Response} from 'express';

export const app = express()

app.use(express.json())

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>

type ErrorsMessages = {
    message: string
    field: string
}

type ErrorType = {
    errorsMessages: ErrorsMessages[]
}

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
export const videoDb: VideoType[] = [
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

app.get('/videos/:id', (req: RequestWithParams<{id: number}>, res: Response) => {
    const id = +req.params.id

    const video = videoDb.find((video) => video.id === id)

    if(!video){
        res.sendStatus(404)
        return
    }

    res.send(video)
})

app.post('/videos', (req: RequestWithBody<{
    title: string,
    author: string,
    availableResolutions: AvailableResolutions[]
}>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} = req.body

    if (!title || !title.length || title.trim().length > 40){
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
    }

    if(!author || !author.length || author.trim().length > 20){
        errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
    }

    if(Array.isArray(availableResolutions) && availableResolutions.length){
        availableResolutions.map((r) => {
            !AvailableResolutions[r] && errors.errorsMessages.push({
                message:'Incorrect availableResolutions',
                field: 'availableResolutions'
            })
        })

    }else {
        availableResolutions = []
    }

    if(errors.errorsMessages.length){
        res.status(400).send(errors)
    }

    const createAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createAt.getDate() + 1)

    const newVideo: VideoType = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videoDb.push(newVideo)

    res.status(201).send(newVideo)
})

app.delete('/videos', (req: Request, res: Response) => {
    videoDb.length = 0
    res.sendStatus(204)
})

app.delete('/videos/:id', (req: RequestWithParams<{id: number}>, res: Response) => {

    for (let i=0; i<videoDb.length; i++) {
        if (videoDb[i].id === +req.params.id) {
            videoDb.splice(i, 1);
            res.send(204)
            return;
        }
    }

    res.sendStatus(404)
})

app.put('/videos/:id', (req: RequestWithBodyAndParams<{id: number}, {
    title: string,
    author: string,
    availableResolutions: AvailableResolutions[],
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}>, res: Response) => {
    const id = +req.params.id
    let video = videoDb.find((video) => video.id === id)

    if(video) {

        let errors: ErrorType = {
            errorsMessages: []
        }

        let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

        if (!title || !title.length || title.trim().length > 40) {
            errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
        }

        if (!author || !author.length || author.trim().length > 20) {
            errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
        }

        if (Array.isArray(availableResolutions) && availableResolutions.length) {
            availableResolutions.map((r) => {
                !AvailableResolutions[r] && errors.errorsMessages.push({
                    message: 'Incorrect availableResolutions',
                    field: 'availableResolutions'
                })
            })

        } else if (!availableResolutions) {
            availableResolutions = []
            video.availableResolutions = availableResolutions
        }

        if (!canBeDownloaded) {
            video.canBeDownloaded = false
        }else if (typeof canBeDownloaded != "boolean") {
            errors.errorsMessages.push({message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded'})
        }else {
            video.canBeDownloaded = req.body.canBeDownloaded
        }

        if (!minAgeRestriction) {
            minAgeRestriction = null
        } else if (typeof minAgeRestriction != "number" || minAgeRestriction > 18 || minAgeRestriction < 1) {
            errors.errorsMessages.push({message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction'})
        }

        if (!publicationDate){
            const createAt = new Date()
            const testDate = new Date()
            testDate.setDate(createAt.getDate() + 1)
            video.publicationDate = testDate.toISOString()
        } else {
            video.publicationDate = req.body.publicationDate
        }

        if (errors.errorsMessages.length) {
            res.status(400).send(errors)
        } else {

            video.minAgeRestriction = req.body.minAgeRestriction
            video.title = req.body.title
            video.author = req.body.author

            res.status(201).send(video)
        }
    } else if(!video){
        res.send(204)
    }else {
        res.send(404)
    }

})