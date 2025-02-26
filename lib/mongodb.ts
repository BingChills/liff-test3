import { MongoClient } from "mongodb";

const uri = "mongodb+srv://linkz:linkz2024@linkz.79c2i.mongodb.net/?retryWrites=true&w=majority&appName=Linkz";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;