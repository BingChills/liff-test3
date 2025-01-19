export default function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    res.status(200).json({ message: `Hello, ${name}!` });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
