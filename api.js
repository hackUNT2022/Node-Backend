const { response } = require("express");
const express = require("express")
const app = express()
const fetch = require("node-fetch")
const cors = require("cors")



const port =8080;

app.use(cors())


app.get('/get_planet_data', (req, res) => {
    planet1 = req.query.p1
    planet2 = req.query.p2    
    date1 = req.query.t1
    date2 = req.query.t2
    
    fetch(`https://solarsystem.nasa.gov/spice_data/getRangefromT1/${planet1}/${planet2}/${date1}/${date2}/1/`)
    .then(response => response.json())
    .then(data => res.status(200).json(data))
    
});

app.get('/', (req, res) => {
    res.send("BEANS");
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))