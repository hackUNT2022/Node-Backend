const { response } = require("express");
const express = require("express")
const app = express()
const fetch = require("node-fetch")
const cors = require("cors")



const port =8080;

// distance from earth in m, km, lightminutese from sun, lightyears, football fields
planetDict = {"Mercury": [913434000, 147003918, 3.2, 0.0000053099],  "Venus": [87913000, 141482259, 6, 0.000011502], "Earth": [0, 8.3, .0000158], "Mars": [155850000, 250816262, 12.7, 0.000022351], "Jupiter": [533220000, 858134407, 43.2, 0.00007865], "Saturn": [946470000, 1523195815, 79.3, 0.00015623], "Uranus": [1523195815, 3095090380, 159.6, 0.00031153], "Neptune": [2851900000, 4589688153, 246, 0.00047295]}

app.use(cors())


const CalcISSdist = () => {
    // Theta has to be in radians
    // Theta(earth-p2p-angle) =  (dist in km) / 6400 km
    radiansTheta = 11500 / 6400
    // Law of cosines
    // k = sqrt(81920000 - 81920000cos(Theta))
    directPath = Math.sqrt(81920000 - 81920000 * Math.cos(radiansTheta))
    // Theta = arctan(400 / k(known direct earth p2p))
    theta = Math.atan(400/directPath)
    // sin for final side length
    finalPath = 400 / Math.sin(theta)
    return finalPath
}



app.get('/bodies',(req,res)=>{

fetch('https://api.le-systeme-solaire.net/rest/bodies/')
.then(response => response.json())
.then(data => {
    console.log(data)
    
    objDict = data["bodies"]
    parsedObjDict = []
    for(i = 0; i < objDict.length; i++)
    {
        tempBody = []
        tempBody.push(objDict[i]["englishName"])
        tempBody.push(objDict[i]["gravity"])
        tempBody.push(objDict[i]["mass"])
        tempBody.push(objDict[i]["meanRadius"])
        tempBody.push(objDict[i]["density"])
        tempBody.push(objDict[i]["escape"])
        tempBody.push((objDict[i]["perihelion"] + objDict[i]["aphelion"]) / 2)  // avg distance from orbiting body

        if(objDict[i]["isPlanet"] == true)
        {
            planetName = objDict[i]["englishName"]
            tempBody.push(planetDict[planetName][0])          // avg dist from earth in mi
            tempBody.push(planetDict[planetName][1])          // avg dist from earth in km
            tempBody.push(planetDict[planetName][2])          // lightminutes from sun
            tempBody.push(planetDict[planetName][3])          // lightyears from sun
            tempBody.push(planetDict[planetName][1] * 10.989) // football fields from earth
        }

        parsedObjDict.push(tempBody)
    }

    res.status(200).json(parsedObjDict)
  })
})


app.get('/iss',(req,res)=>{

fetch('https://api.wheretheiss.at/v1/satellites/25544%27)')
.then(response => response.json())
.then(data => {
 
    lat_long_list = []
    lat_long_list.push(data["latitude"])
    lat_long_list.push(data["longitude"])

    res.status(200).json(lat_long_list)
})
})


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
    res.status(200).send("BEANS");
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))