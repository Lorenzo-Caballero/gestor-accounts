import app from "./functions/app.js"
import {PORT} from "./config.js"

app.listen( PORT);
console.log("server esta corriendo en puerto ",PORT)