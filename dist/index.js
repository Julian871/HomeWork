"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = 5005;
settings_1.app.listen(port, () => {
    console.log(`Started on ${port} port`);
});
