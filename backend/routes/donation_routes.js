import express from "express";
import authMiddleware from "../middleware/auth_middleware.js";
import { authorizeRoles } from "../middleware/role_middleware.js";

import {
  addDonation,
  fetchDonations,
  approveDonation,
  claimDonation
} from "../controllers/donation_controller.js";

const router = express.Router();

// USER - Create donation
router.post(
  "/create",
  authMiddleware,
  authorizeRoles("user"),
  addDonation
);

// USER - Fetch own donations
router.get(
  "/my-donations",
  authMiddleware,
  authorizeRoles("user"),
  fetchDonations
);

// ADMIN - Approve donation
router.put(
  "/approve/:id",
  authMiddleware,
  authorizeRoles("admin"),
  approveDonation
);

// NGO - Claim donation
router.post(
  "/claim/:id",
  authMiddleware,
  authorizeRoles("ngo"),
  claimDonation
);

export default router;
