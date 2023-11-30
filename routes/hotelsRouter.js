const {Router} = require("express");
const { addHotel, updateHotel, deleteHotel, getHotel, getHotels, searchHotels } = require("../controllers/hotelController");

const hotelRouter = Router();

hotelRouter.post("/add",async (req,res) => {
    try {
        if(!req.isAuth) {
            throw new Error("Unauthenticated access");
        }
        const data = await addHotel(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})
hotelRouter.patch("/:hotelId",async (req,res) => {
    try {
        if(!req.isAuth) {
            throw new Error("Unauthenticated access");
        }
        const data = await updateHotel(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})
hotelRouter.delete("/:hotelId",async (req,res) => {
    try {
        if(!req.isAuth) {
            throw new Error("Unauthenticated access");
        }
        const data = await deleteHotel(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})

hotelRouter.get("/hotelDetails/:hotelId", async(req,res) => {
    try {
        const data = await getHotel(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})

hotelRouter.get("/all", async(req,res) => {
    try {
        const data = await getHotels(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})

hotelRouter.get("/search", async (req,res) => {
    try {
        const data = await searchHotels(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message});
    }
})

module.exports = hotelRouter;