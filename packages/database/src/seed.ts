import { db } from "./index";

const existing = await db.orm.public.User.select("id").all();
if (existing.length === 0) {
  await db.orm.public.User.create({
    email: "younus@gmail.com",
    username: "younus",
    password: "hello",
  });
}
console.log(await db.orm.public.User.select("id", "email", "username").all());
await db.close();
