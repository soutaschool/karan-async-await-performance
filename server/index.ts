import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from 'hono/cors';

const app = new Hono();
app.use("*", cors())

app.get("/api/data", async (c) => {
	// Simulate a delay
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return c.json({ data: "Sample Data" });
});

const port = 3000;
console.log(`Server is running on port http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
