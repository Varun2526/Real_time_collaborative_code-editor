import { config } from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

config();

//connect to db
connectDB();

//run the server 

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;

