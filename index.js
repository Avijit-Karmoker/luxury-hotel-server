const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
const { ObjectID, ObjectId } = require("bson");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("doctors"));
app.use(fileUpload());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zom1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const roomsCollection = client.db("LuxuryHotel").collection("rooms");
  const bookingCollection = client.db("LuxuryHotel").collection("bookings");
  const adminCollection = client.db("LuxuryHotel").collection("admin");
  const reviewCollection = client.db("LuxuryHotel").collection("review");

  app.get("/rooms", (req, res) => {
    roomsCollection.find()
    .toArray((err, rooms) => {
      res.send(rooms);
    })
  })

  app.post("/addRoom", (req, res) => {
    const newRoom = req.body;
    console.log('adding new room: ', newRoom);
    roomsCollection.insertOne(newRoom)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  });

  app.get("/orderDetails/:id", (req, res) => {
    roomsCollection
    .find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addBooking', (req, res) => {
    const booking = req.body;
    bookingCollection.insertOne(booking)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/reviews', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get("/bookings", (req, res) => {
    bookingCollection.find()
    .toArray((err, books) => {
      res.send(books);
    })
  })

  app.get("/reviews", (req, res) => {
    reviewCollection.find()
    .toArray((err, reviews) => {
      res.send(reviews);
    })
  })

  app.post('/addAAdmin', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(name, email);
    adminCollection.insertOne({name, email}).then((result) => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get("/admins", (req, res) => {
    adminCollection.find()
    .toArray((err, admin) => {
      res.send(admin);
    })
  })


});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);