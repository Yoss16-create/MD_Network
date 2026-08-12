const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customers");
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MD_Network Backend aktif 🚀"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "online"
  });
});

app.listen(PORT, () => {
  console.log(`MD_Network Backend berjalan di http://localhost:${PORT}`);
});