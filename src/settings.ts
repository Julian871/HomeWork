import express, {Request, Response, Router} from 'express';

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

export const videosRouter = Router({})

app.use('/videos', videosRouter)


app.get('/', (req: Request, res:Response) => {
    res.send('Zero page')
})

videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videoDb)
})

videosRouter.get('/:id', (req: RequestWithParams<{id: number}>, res: Response) => {
    const id = +req.params.id

    const video = videoDb.find((video) => video.id === id)

    if(!video){
        res.sendStatus(404)
        return
    }

    res.send(video)
})

videosRouter.post('/', (req: RequestWithBody<{
    title: string,
    author: string,
    availableResolutions: AvailableResolutions[]
}>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} = req.body

    if (!title || !title.trim || title.length > 40){
        errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
    }

    if(!author || !author.trim || author.length > 20){
        errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
    }

    if(Array.isArray(availableResolutions) && availableResolutions.length){
        const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el))
        if(!isValid){
            errors.errorsMessages.push({
                message:'Incorrect availableResolutions',
                field: 'availableResolutions'
            })
        }
    }

    if(errors.errorsMessages.length){
        res.status(400).send(errors)
    } else {

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
    }
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videoDb.length = 0
    res.send(204)
})

videosRouter.delete('/:id', (req: Request, res: Response) => {

    for (let i=0; i<videoDb.length; i++) {
        if (videoDb[i].id === +req.params.id) {
            videoDb.splice(i, 1);
            res.send(204)
            return;
        }
    }

    res.sendStatus(404)
})

videosRouter.put('/:id', (req: RequestWithBodyAndParams<{id: number}, {
    title: string,
    author: string,
    availableResolutions: AvailableResolutions[],
    canBeDownloaded: boolean,
    minAgeRestriction: number,
    publicationDate: string
}>, res: Response) => {
    const id = +req.params.id
    const video = videoDb.find((video) => video.id === id)

    if(video) {

        const errors: ErrorType = {
            errorsMessages: []
        }

        const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

        if (!title || !title.trim() || title.length > 40) {
            errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
        }

        if (!author || !author.trim() || author.length > 20) {
            errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
        }

        if (Array.isArray(availableResolutions) && availableResolutions.length) {
            const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el))
            if(!isValid){
                errors.errorsMessages.push({
                    message: 'Incorrect availableResolutions',
                    field: 'availableResolutions'
                })
            }
        }


        if (typeof canBeDownloaded !== 'undefined' && typeof canBeDownloaded !== 'boolean') {
            errors.errorsMessages.push({message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded'})
        }

        if (!minAgeRestriction || typeof minAgeRestriction !== "number" || minAgeRestriction > 18 || minAgeRestriction < 1) {
            errors.errorsMessages.push({message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction'})
        }

        if (!publicationDate || typeof publicationDate !== 'string'){
            errors.errorsMessages.push({message: 'Incorrect publicationDate', field: 'publicationDate'})
        }

        if (errors.errorsMessages.length) {
            res.status(400).send(errors)
        } else {

            video.availableResolutions = availableResolutions
            video.minAgeRestriction = minAgeRestriction
            video.canBeDownloaded = canBeDownloaded
            video.publicationDate = publicationDate
            video.title = title
            video.author = author

            res.status(204).send()
        }
    } else {
        res.send(404)
    }
})