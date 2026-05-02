import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import projectRouter from "./routes/project.routes.js"
import taskRouter from "./routes/task.routes.js"

const app = express()
const port = process.env.PORT || 8000 

app.use(express.json())
app.use(cookieParser())
app.use(cors({
     origin: "http://localhost:5173",
     credentials: true 
}))

app.use("/api/auth", authRouter)
app.use("/api/project", projectRouter)
app.use("/api/task", taskRouter)

app.listen(port, () => {
    console.log(`server started with port ${port}`)
    connectDb()
})