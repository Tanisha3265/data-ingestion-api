const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('✅ Test successful: Server is running and responding on /');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Test server running at http://localhost:${PORT}`);
});
