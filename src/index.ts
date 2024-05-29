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
  .get("/api/todo/:id", (c) => {
    const id = Number(c.req.param("id"));
    return c.json(todos.find((todo: any) => todo.id === id));
  })
  .post("/api/todos", async (c) => {
    const todo = await c.req.json();
    todos.push(todo);
    Bun.write("src/todos.json", JSON.stringify(todos));
    return c.json(todo);
  })
  .delete("/api/todo/:id", (c) => {
    const id = Number(c.req.param("id"));
    todos.splice(
      todos.findIndex((todo: any) => todo.id === id),
      1
    );
    Bun.write("src/todos.json", JSON.stringify(todos));
    return c.json({ success: true });
  })
  .patch("/api/todo/toggle/:id", (c) => {
    const id = Number(c.req.param("id"));
    const todo = todos.find((todo: any) => todo.id === id);
    todo.completed = !todo.completed;
    Bun.write("src/todos.json", JSON.stringify(todos));
    return c.json(todo);
  })
  .patch("/api/todo/edittitle/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const todo = todos.find((todo: any) => todo.id === id);
    todo.title = body.title;
    Bun.write("src/todos.json", JSON.stringify(todos));
    return c.json(todo);
  })
  .patch("/api/todo/edittitle2", async (c) => {
    const body = await c.req.json();
    const todo = todos.find((todo: any) => todo.title.includes(body.search));
    todo.title = body.title;
    Bun.write("src/todos.json", JSON.stringify(todos));
    return c.json(todo);
  })
  .patch("/api/todo/edittitle3", async (c) => {
    const body = await c.req.json();
    const todo = todos.find((todo: any) =>
      todo.title.toLowerCase().includes(body.search.toLowerCase())
    );
    todo.title = body.title;
    Bun.write("src/todos.json", JSON.stringify(todos));
    return c.json(todo);
  });
export default app;
