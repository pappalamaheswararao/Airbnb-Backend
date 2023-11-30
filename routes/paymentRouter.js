const {Router} = require("express");
const { createCheckout } = require("../controllers/paymentController");
const paymentRouter = Router();

paymentRouter.post("/create-checkout", async(req,res) => {
    try {
        if(!req.isAuth) throw new Error("Unauthenticated access");
        const data = await createCheckout(req);
        res.redirect(303, data.url);
    } catch (error) {
        console.log(error);
        res.send({error: error.message})
    }
})


module.exports = paymentRouter;