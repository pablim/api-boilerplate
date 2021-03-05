var express = require('express');
const csvtojson = require("csvtojson");
const fs = require('fs');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const assert = require('assert');
const mongo = require('./db')
const mongodb = require('mongodb')

require('dotenv').config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : process.env.NODE_ENV === "test" ? ".env.test" : ".env.development"
});

var app = express();

require('./routes/graphql')(app)

app.use('/import', (req, res) => {
    fs.readFile('files/teste.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    });

    csvtojson()
        .fromFile("files/modelos-veiculos.csv")
        .then(async csvData => {
            //console.log(csvData);
            const db = await mongo.execute()
            const result = await db.collection('modelos').insertMany(csvData, (err, res) => {
                if (err) throw err;
                console.log(`Inserted: ${res.insertedCount} rows`);
            })
            console.log(result)
        })
    res.send("ok")
})



app.get("/teste", (req, res) => {
    //res.send("testando...")
    res.send({ title: "testando", version: "1.0" })

    // db.execute((conn) => {
    //   conn.collection('pessoa').insertOne({
    //     nome: "Juliany Faria Alvarenga",
    //     email: "julianyfaria@gmail.com"
    //   })
    // })
})

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000');