// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
//RhGcmFSzEPaIfXH9
// const express = require("express");
const app = express();
app.use(express.json());

// const PORT = 4005;
const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

var home =
  "Hello World, This is student and mentor Task, 1) For Student Data = /studentdata , 2) For Mentor Data = /mentordata  3) For Assign_Mentor = /assign-mentor  ";
app.get("/", function (request, response) {
  response.send(home);
});

app.get("/studentdata", async function (request, response) {
  //db.sampledata.find({})
  const sampledata = await client
    .db("mentor_student")
    .collection("data1")
    .find({})
    .toArray();
  response.send(sampledata);
});

app.get("/mentordata", async function (request, response) {
  //db.sampledata.find({})
  const sampledata = await client
    .db("mentor_student")
    .collection("data2")
    .find({})
    .toArray();
  response.send(sampledata);
});

//http://localhost:4005/studentdata
app.post("/studentdata", async function (request, response) {
  const datas = request.body;
  const data = await client
    .db("mentor_student")
    .collection("data1")
    .insertMany(datas);
  console.log(data);
  response.send(data);
});

//http://localhost:4005/studentdata
app.post("/mentordata", async function (request, response) {
  const datas = request.body;
  const data = await client
    .db("mentor_student")
    .collection("data2")
    .insertMany(datas);
  console.log(data);
  response.send(data);
});

//http://localhost:4005/assign-mentor
app.get("/assign-mentor", async function (request, response) {
  const data = await client
    .db("mentor_student")
    .collection("data2")
    .aggregate([
      {
        $lookup: {
          from: "data2",
          localField: "assign_mentor_id",
          foreignField: "mentor_id",
          as: "mentor_name",
        },
      },
    ])
    .toArray();
  response.send(data);
});
console.log(process.env);
console.log(process.env.MONGO_URL);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
