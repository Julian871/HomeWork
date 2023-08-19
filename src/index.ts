import {app} from "./settings";

const port = process.env.PORT || 5005



app.listen(port, () => {
    console.log(`Started on ${port} port`)
})