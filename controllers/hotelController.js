const { ObjectId } = require("mongodb");
const { hotels } = require("../mongoConfig")

const addHotel = (req) => {
    return hotels.insertOne({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: req.userId
    })
}

const updateHotel = async(req) => {
    const {hotelId} = req.params;
    const hid = new ObjectId(hotelId);
    const hotelData = await hotels.findOne({_id: hid});
    if(hotelData.owner !== req.userId) {
        throw new Error("Unauthorized access")
    }
    return hotels.findOneAndUpdate({_id: hid}, {
        ...req.body,
        updatedAt: new Date()
    })
}

const deleteHotel = async(req) => {
    const {hotelId} = req.params;
    const hid = new ObjectId(hotelId);
    const hotelData = await hotels.findOne({_id: hid});
    if(hotelData.owner !== req.userId) {
        throw new Error("Unauthorized access")
    }
    return hotels.findOneAndDelete({_id: hid})
}

const getHotel = (req) => {
    const {hotelId} = req.params;
    const hid = new ObjectId(hotelId);
    return hotels.findOne({_id: hid})
}

const getHotels = (req) => {
    const {limit,page} = req.query;
    return hotels.find({}).limit(parseInt(limit)).skip(parseInt(limit)*parseInt(page)).sort({createAt: "desc"}).toArray();
}

const searchHotels = (req) => {
    const {limit,page,search} = req.query;
    return hotels.find({
        $text: {$search: search}
    }).limit(parseInt(limit)).skip(parseInt(limit)*parseInt(page)).sort({createAt: "desc"}).toArray();
}

module.exports = {addHotel,updateHotel,deleteHotel,getHotel,getHotels,searchHotels};