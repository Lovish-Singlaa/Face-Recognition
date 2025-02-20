import express from "express"
import multer from "multer"
import { createUser, fetchUsers, receivePythonData, updateAttendance } from "../controllers/user.controller.js"

const upload = multer({ dest: "uploads/" });

const router = express.Router()
router.route('/create-user').post(upload.single("image"),createUser)
router.route('/fetch-data').get(fetchUsers)
router.route('/receive-data').post(receivePythonData)
router.route('/update-attendance').post(updateAttendance)

export default router