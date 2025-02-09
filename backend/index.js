const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from KaporalFit API' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 