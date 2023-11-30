const stripe = require("stripe")(process.env.STRIPE_KEY)

const createCheckout = async(req) => {
    const {name,description,image,unit_price,startDate,endDate,guests,hotelId,location,email} = req.body;
    const quantity = Math.floor((new Date(endDate.toString()) - new Date(startDate.toString()))/(24*3600000));
    const session = await stripe.checkout.sessions.create({
        customer_email: email,
        line_items: [
            {
                price_data: {
                  currency: 'inr',
                  product_data: {
                    name, description,images: [image],
                    metadata: {
                        startDate, endDate,guests,hotelId,location
                    }
                  },
                  unit_amount: unit_price*100,
                },
                quantity,
            },
            
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success?${JSON.stringify({
            hotelId, startDate, endDate, guests, userId: req.userId,email
        })}`,
        cancel_url: `http://localhost:3000/failure?${JSON.stringify({
            hotelId, startDate, endDate, guests, userId: req.userId,email
        })}`,
    })
    return session;
}

module.exports = {createCheckout};