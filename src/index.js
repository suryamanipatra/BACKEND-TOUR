import {app} from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./database/index.js";


dotenv.config({
    path:"./.env"
})

const PORT = process.env.PORT || 8001
dbConnect().then(() => {
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error)=>{
    console.log("Database Connection issue !!!",error)
})