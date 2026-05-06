require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');


const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port} (all interfaces)`);
});

connectDB().catch((err) => {
  console.log("MONGO db connection failed !!! ", err);
});