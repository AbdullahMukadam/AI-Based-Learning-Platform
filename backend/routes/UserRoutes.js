import express from "express"
import { Signup } from "../controller/UserController.js"

const router = express.Router()

router.get("/signup",Signup)

export default router