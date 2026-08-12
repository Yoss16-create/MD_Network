const express = require("express");

const router = express.Router();

let customers = [];

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: customers
  });
});

router.post("/", (req, res) => {
  const { name, phone, address, packageName, status } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Nama pelanggan wajib diisi"
    });
  }

  const customer = {
    id: `CUS-${Date.now()}`,
    name,
    phone: phone || "-",
    address: address || "-",
    packageName: packageName || "Internet",
    status: status || "Aktif",
    createdAt: new Date().toISOString()
  };

  customers.push(customer);

  res.status(201).json({
    success: true,
    message: "Pelanggan berhasil ditambahkan",
    data: customer
  });
});

module.exports = router;