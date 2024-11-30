import express from "express"
import dotenv from "dotenv"
import { ConnectToDb } from "./utils/ConnectToDb.js"
import UserRoutes from "./routes/UserRoutes.js"
import cookieParser from "cookie-parser"
const app = express()

dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

ConnectToDb();

app.use("/api/user",UserRoutes)


app.get("/", (req, res)=>{
 res.send("hello")
})

app.listen(8000, ()=>{
    console.log("server started")
})