import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { signin, signup } from './controllers/authController.js';
import { deleteUser, getUser, putUser } from './controllers/userController.js';

const app = express();
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
await mongoClient.connect();
const db = mongoClient.db("oscar-niemeyer");

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  const passwordHash = bcrypt.hashSync(user.password, 10);

  await db.collection('users').insertOne({ ...user, password: passwordHash })

  res.sendStatus(201);
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection('users').findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();

    await db.collection('sessions').insertOne({ token, userId: user._id });

    res.send(token);
  } else {
    res.sendStatus(401);
  }
});

app.get("/user", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '')

  if (!token) {
    return res.sendStatus(401)
  }

  const session = await db.collection('sessions').findOne({ token });
  if (!session) {
    return res.sendStatus(401)
  }

  const user = await db.collection('users').findOne({ _id: session.userId });
  if (!user) {
    return res.sendStatus(401);
  }

  delete user.password;

  res.send(user);
});

app.put("/user", async (req, res) => {
  const newUser = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '')

  if (!token) {
    return res.sendStatus(401)
  }

  const session = await db.collection('sessions').findOne({ token });
  if (!session) {
    return res.sendStatus(401)
  }

  const user = await db.collection('users').findOne({ _id: session.userId });
  if (!user) {
    return res.sendStatus(401);
  }

  await db.collection('users').updateOne({_id: session.userId}, {$set: newUser});

  res.sendStatus(200);
});

app.delete("/user", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '')

  if (!token) {
    return res.sendStatus(401)
  }

  const session = await db.collection('sessions').findOne({ token });
  if (!session) {
    return res.sendStatus(401)
  }

  const user = await db.collection('users').findOne({ _id: session.userId });
  if (!user) {
    return res.sendStatus(401);
  }

  await db.collection('users').deleteOne({ _id: session.userId });

  res.sendStatus(200);
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000.');
});
