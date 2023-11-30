const { ObjectId } = require("mongodb");
const { trips, users } = require("../mongoConfig");
const { sendMail } = require("../utils/mailer");

const addTrip = async (req) => {
    const {status,email} = req.body;
    if(status == "failure") {
        sendMail(email,"Paymnet Failed","Trip not book beacuse of payment failure please try again");
        throw new Error("Payment failed check email for details")
    }
    const tripData = await  trips.insertOne({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    await users.findOneAndUpdate({_id: new ObjectId(req.userId)}, {
        $push: {
            trips: tripData.insertedId
        }
    })
    return tripData;
}

const getTrip = (req) => {
    return trips.findOne({_id: new ObjectId(req.params.tripId)})
}

module.exports = {addTrip,getTrip};