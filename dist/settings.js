"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoDb = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.app = (0, express_1.default)();
const parserMiddleware = (0, body_parser_1.default)({});
exports.app.use(parserMiddleware);
exports.app.use(express_1.default.json());
var AvailableResolutions;
(function (AvailableResolutions) {
    AvailableResolutions["P144"] = "P144";
    AvailableResolutions["P240"] = "P240";
    AvailableResolutions["P360"] = "P360";
    AvailableResolutions["P480"] = "P480";
    AvailableResolutions["P720"] = "P720";
    AvailableResolutions["P1080"] = "P1080";
    AvailableResolutions["P1440"] = "P1440";
    AvailableResolutions["P2160"] = "P2160";
})(AvailableResolutions || (AvailableResolutions = {}));
// create local database
exports.videoDb = [
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
];
exports.app.get('/', (req, res) => {
    res.send('Zero page');
});
exports.app.get('/videos', (req, res) => {
    res.send(exports.videoDb);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = exports.videoDb.find((video) => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.app.post('/videos', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
    }
    if (Array.isArray(availableResolutions) && availableResolutions.length) {
        availableResolutions.map((r) => {
            !AvailableResolutions[r] && errors.errorsMessages.push({
                message: 'Incorrect availableResolutions',
                field: 'availableResolutions'
            });
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
    }
    const createAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    exports.videoDb.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.delete('/videos', (req, res) => {
    exports.videoDb.length = 0;
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    for (let i = 0; i < exports.videoDb.length; i++) {
        if (exports.videoDb[i].id === +req.params.id) {
            exports.videoDb.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.sendStatus(404);
});
exports.app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    let video = exports.videoDb.find((video) => video.id === id);
    if (video) {
        let errors = {
            errorsMessages: []
        };
        let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
        if (!title || !title.length || title.trim().length > 40) {
            errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
        }
        if (!author || !author.length || author.trim().length > 20) {
            errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
        }
        if (Array.isArray(availableResolutions) && availableResolutions.length) {
            availableResolutions.map((r) => {
                !AvailableResolutions[r] && errors.errorsMessages.push({
                    message: 'Incorrect availableResolutions',
                    field: 'availableResolutions'
                });
            });
        }
        else if (!availableResolutions) {
            availableResolutions = [];
            video.availableResolutions = availableResolutions;
        }
        if (!canBeDownloaded) {
            video.canBeDownloaded = false;
        }
        else if (typeof canBeDownloaded != "boolean") {
            errors.errorsMessages.push({ message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded' });
        }
        else {
            video.canBeDownloaded = req.body.canBeDownloaded;
        }
        if (!minAgeRestriction) {
            minAgeRestriction = null;
        }
        else if (typeof minAgeRestriction != "number" || minAgeRestriction > 18 || minAgeRestriction < 1) {
            errors.errorsMessages.push({ message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction' });
        }
        if (!publicationDate) {
            const createAt = new Date();
            const testDate = new Date();
            testDate.setDate(createAt.getDate() + 1);
            video.publicationDate = testDate.toISOString();
        }
        else {
            video.publicationDate = req.body.publicationDate;
        }
        if (errors.errorsMessages.length) {
            res.status(400).send(errors);
        }
        else {
            video.minAgeRestriction = req.body.minAgeRestriction;
            video.title = req.body.title;
            video.author = req.body.author;
            res.status(201).send(video);
        }
    }
    else if (!video) {
        res.send(204);
    }
    else {
        res.send(404);
    }
});
