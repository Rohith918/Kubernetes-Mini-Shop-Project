const express = require('express');
require('dotenv').config();

const healthRoute = require('./routes/health');
const productsRoute = require('./routes/products');

const app = express();
app.use(express.json());

app.use('/health', healthRoute);
app.use('/products', productsRoute);

// Deliberately CPU-heavy endpoint — useful for triggering HPA scaling in K8s
app.get('/stress', (req, res) => {
  let x = 0;
  for (let i = 0; i < 1e9; i++) x += i;
  res.json({ done: x });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
