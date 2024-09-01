import { Router } from "express";


import {checkController} from "../controllers/check.controller.js"

const router = Router();

router.route("/").get(checkController)

export default router