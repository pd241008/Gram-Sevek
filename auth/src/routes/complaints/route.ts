import express from "express";
import {
  createComplaintHandler,
  getComplaintsHandler,
  updateStatusHandler,
} from "../../controllers/complaint_controller";

const router = express.Router();

router.post("/", createComplaintHandler);
router.get("/", getComplaintsHandler);
router.patch("/status", updateStatusHandler);

export default router;
