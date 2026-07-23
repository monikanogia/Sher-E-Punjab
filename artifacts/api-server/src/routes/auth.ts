import { Router, type IRouter, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "change_me_secret";

router.post("/admin/login", async (req: Request, res: Response) => {
  try {
    const parsed = AdminLoginBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { username, password } = parsed.data;
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, username));
    if (!admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, username: admin.username });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/me", async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    res.json({ id: payload.id, username: payload.username });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export { JWT_SECRET };
export default router;
