import { Router, type IRouter } from "express";
import healthRouter from "./health";
import onboardingRouter from "./onboarding";
import businessListingRouter from "./businessListing";

const router: IRouter = Router();

router.use(healthRouter);
router.use(onboardingRouter);
router.use(businessListingRouter);

export default router;
