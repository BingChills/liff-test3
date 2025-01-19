import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/auth", (req, res) => {
  const { idToken } = req.body;
  res.send(`Hello World: ${idToken}`);
});

app.use((res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
