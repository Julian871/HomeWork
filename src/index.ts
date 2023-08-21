import {app} from "./settings";


const port = 5001


app.listen(port, () => {
    console.log(`Started on ${port} port`)
})