import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import menuRouter from "./menu.js";
import adminCategoriesRouter from "./adminCategories.js";
import adminDishesRouter from "./adminDishes.js";
import adminSettingsRouter from "./adminSettings.js";
import adminStatsRouter from "./adminStats.js";
import adminTablesRouter from "./adminTables.js";
import analyticsRouter from "./analytics.js";
import developerAnalyticsRouter from "./developerAnalytics.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menuRouter);
// Public customer tracking must be mounted before the admin routers. Each admin
// router installs requireAdmin at router scope, so it rejects later routes.
router.use(analyticsRouter);
router.use(adminCategoriesRouter);
router.use(adminDishesRouter);
router.use(adminSettingsRouter);
router.use(adminStatsRouter);
router.use(adminTablesRouter);
router.use(developerAnalyticsRouter);

export default router;
