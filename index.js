const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Calculating risks.'));
app.listen(port, () => console.log(`Staying alive at http://localhost:${port}`));
console.log("...")