const {Router} = require("express");
const { addAddress, updateAddress, deleteAddress, getAddress, getAddresses } = require("../controllers/addressController");

const addressRouter = Router();

addressRouter.post("/add",async (req,res) => {
    try {
        if(!req.isAuth) {
            throw new Error("Unauthenticated access");
        }
        const data = await addAddress(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})
addressRouter.patch("/:hotelId",async (req,res) => {
    try {
        if(!req.isAuth) {
            throw new Error("Unauthenticated access");
        }
        const data = await updateAddress(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})
addressRouter.delete("/:hotelId",async (req,res) => {
    try {
        if(!req.isAuth) {
            throw new Error("Unauthenticated access");
        }
        const data = await deleteAddress(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})

addressRouter.get("/:hotelId", async(req,res) => {
    try {
        const data = await getAddress(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})

addressRouter.get("/all", async(req,res) => {
    try {
        const data = await getAddresses(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})

module.exports = addressRouter;