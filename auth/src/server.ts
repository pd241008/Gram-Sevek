import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./utils/database";

dotenv.config();

// Connect to DB unblocking the event loop
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
