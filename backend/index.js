import express from "express"
import dotenv from "dotenv"
import { ConnectToDb } from "./utils/ConnectToDb.js"
import UserRoutes from "./routes/UserRoutes.js"
import cookieParser from "cookie-parser"
import cors from 'cors';
const app = express()

dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

ConnectToDb();

app.use("/api/user",UserRoutes)


app.get("/", (req, res)=>{
 res.send("hello")
})

app.listen(8000, ()=>{
    console.log("server started")
})