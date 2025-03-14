import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import { User } from "./models/user.model.js"
import fs from 'fs/promises'
import isAuthenticated from "./middlewares/auth.middleware.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
try {
    await fs.access(uploadsDir);
} catch {
    await fs.mkdir(uploadsDir);
}

dotenv.config()
const app = express()

app.use(express.static('public'))

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const corsOptions = {
    origin: "*",
    credentials: true,
}
// app.use(cors(corsOptions))
app.use(cors())

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir) // Use the uploads directory path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

// Routes
app.get('/register', isAuthenticated,(req, res) => {
    res.render('form');
});

app.use("/api/v1", userRoute);

app.get("/", (req,res)=>{
    res.redirect("/api/v1/users");
})

const PORT = process.env.PORT || 3000;
let receivedData = {};

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
