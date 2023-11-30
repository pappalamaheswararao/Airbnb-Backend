const {Router} = require("express");
const { addTrip, getTrip } = require("../controllers/tripController");

const tripRouter = Router();

tripRouter.post("/add", async (req,res) => {
    try {
        if(!req.isAuth) throw new Error("Unauthenticated access");
        const data = await addTrip(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message})
    }
})

tripRouter.get("/:tripId", async(req,res) => {
    try {
        if(!req.isAuth) throw new Error("Unauthenticated access");
        const data = await getTrip(req);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({error: error.message})
    }
})

module.exports = tripRouter;