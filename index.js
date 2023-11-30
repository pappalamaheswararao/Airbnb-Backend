require("dotenv").config();
const express = require("express");
const {json,urlencoded} = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const auth = require("./middlewares/auth");
const paymentRouter = require("./routes/paymentRouter");
const addressRouter = require("./routes/addressRouter");
const hotelRouter = require("./routes/hotelsRouter");

const {hotels} = require("./mongoConfig")

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({extended:true}));
app.use(auth);

app.use("/users",userRouter);
app.use("/address",addressRouter);
app.use("/hotels",hotelRouter);
app.use("/payment",paymentRouter);

// hotels.createIndex({
//     summary: "text",
//     space: "text",
//     description: "text",
//     neighborhood_overview: "text",
//     transit: "text",
//     access: "text",
//     host_about: "text",
//     host_response_time: "text",
//     amenities: "text",
//     street: "text",
//     name: "text",
// },
// {
//     name: "HotelsTextIndex"
// }
// )

app.listen(4000, ()=>console.log("Server running at port 4000"));