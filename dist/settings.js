"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoDb = exports.app = void 0;
const express_1 = __importStar(require("express"));
exports.app = (0, express_1.default)();
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
const videosRouter = (0, express_1.Router)({});
exports.app.use('/videos', videosRouter);
exports.app.get('/', (req, res) => {
    res.send('Zero page');
});
videosRouter.get('/', (req, res) => {
    res.send(exports.videoDb);
});
videosRouter.get('/:id', (req, res) => {
    const id = +req.params.id;
    const video = exports.videoDb.find((video) => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
videosRouter.post('/', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.trim || title.length > 40) {
        errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
    }
    if (!author || !author.trim || author.length > 20) {
        errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
    }
    if (Array.isArray(availableResolutions) && availableResolutions.length) {
        const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el));
        if (!isValid) {
            errors.errorsMessages.push({
                message: 'Incorrect availableResolutions',
                field: 'availableResolutions'
            });
        }
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
    }
    else {
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
    }
});
exports.app.delete('/testing/all-data', (req, res) => {
    exports.videoDb.length = 0;
    res.send(204);
});
videosRouter.delete('/:id', (req, res) => {
    for (let i = 0; i < exports.videoDb.length; i++) {
        if (exports.videoDb[i].id === +req.params.id) {
            exports.videoDb.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.sendStatus(404);
});
videosRouter.put('/:id', (req, res) => {
    const id = +req.params.id;
    const video = exports.videoDb.find((video) => video.id === id);
    if (video) {
        const errors = {
            errorsMessages: []
        };
        const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
        if (!title || !title.trim() || title.length > 40) {
            errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
        }
        if (!author || !author.trim() || author.length > 20) {
            errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
        }
        if (Array.isArray(availableResolutions) && availableResolutions.length) {
            const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el));
            if (!isValid) {
                errors.errorsMessages.push({
                    message: 'Incorrect availableResolutions',
                    field: 'availableResolutions'
                });
            }
        }
        if (!canBeDownloaded || typeof canBeDownloaded !== "boolean") {
            errors.errorsMessages.push({ message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded' });
        }
        if (!minAgeRestriction || typeof minAgeRestriction !== "number" || minAgeRestriction > 18 || minAgeRestriction < 1) {
            errors.errorsMessages.push({ message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction' });
        }
        if (!publicationDate || typeof publicationDate !== 'string') {
            errors.errorsMessages.push({ message: 'Incorrect publicationDate', field: 'publicationDate' });
        }
        if (errors.errorsMessages.length) {
            res.status(400).send(errors);
        }
        else {
            video.availableResolutions = availableResolutions;
            video.minAgeRestriction = minAgeRestriction;
            video.canBeDownloaded = canBeDownloaded;
            video.publicationDate = publicationDate;
            video.title = title;
            video.author = author;
            res.status(204).send();
        }
    }
    else {
        res.send(404);
    }
});
