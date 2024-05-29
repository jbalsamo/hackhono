import { Hono } from "hono";
import { logger } from "hono/logger";

const file = Bun.file("src/todos.json");
const todos = await file.json();

const app = new Hono();

app.use(logger());

app
  .get("/", (c) => {
    return c.text("Hello, Hono!");
  })
  .get("/api/hello/:name", (c) => {
    const name = c.req.param("name");
    return c.text(`Hello, ${name}!`);
  })
  .get("/api/todos", (c) => {
    return c.json(todos);
  })
  .post("/todos", async (c) => {
    const todo = await c.req.json();
    todos.push(todo);
    Bun.write("src/todos.json", JSON.stringify(todos));
    return c.json(todo);
  });

export default app;
