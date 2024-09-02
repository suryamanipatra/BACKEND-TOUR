import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()


app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials:true
    })
)

// common middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// import routes
import {checkController}  from "./controllers/check.controller.js"

// routes
app.use("/api/v1/check", checkController)

export{app}