const { ObjectId } = require("mongodb");
const { address, users } = require("../mongoConfig")

const addAddress = async(req) => {
    const addressData = await address.insertOne({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: req.userId
    });
    const userId = new ObjectId(req.userId);
    await users.findOneAndUpdate({_id: userId}, {
        $push: {
            address: addressData.insertedId
        }
    })
    return addressData;
}

const updateAddress = async(req) => {
    const {addressId} = req.params;
    const aid = new ObjectId(addressId);
    const addressData = await address.findOne({_id: aid});
    if(addressData.owner !== req.userId) {
        throw new Error("Unauthorized access")
    }
    return address.findOneAndUpdate({_id: aid}, {
        ...req.body,
        updatedAt: new Date()
    })
}

const deleteAddress = async(req) => {
    const {addressId} = req.params;
    const aid = new ObjectId(addressId);
    const addressData = await address.findOne({_id: aid});
    if(addressData.owner !== req.userId) {
        throw new Error("Unauthorized access")
    }
    const userId = new ObjectId(req.userId);
    await users.findOneAndUpdate({_id: userId}, {
        $pull: {
            address: addressId
        }
    })
    return address.findOneAndDelete({_id: aid})
}

const getAddress = (req) => {
    const {addressId} = req.params;
    const aid = new ObjectId(addressId);
    return address.findOne({_id: aid})
}

const getAddresses = async(req) => {
    const {limit,page} = req.query;
    const userData = await users.findOne({_id: new ObjectId(req.userId)});
    const {address:addressArr} = userData;
    const skip  = parseInt(limit)*parseInt(page);
    addressArr.slice(skip, skip+parseInt(limit));
    const addressPromise = addressArr.map(e => address.findOne({_id: new ObjectId(e)}));
    const addressData = await Promise.allSettled(addressPromise);
    return addressData.map(e => e.value);
}

module.exports = {addAddress,updateAddress,deleteAddress,getAddress,getAddresses};