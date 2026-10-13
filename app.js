require('dotenv').config();

const express = require('express');
const path = require('node:path');
const app = express();

const inventoryRouter = require('./routes/inventoryRouter')

app.set(path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', inventoryRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Check your console for details.')
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);  
})