const { genSalt, hash, compare } = require("bcrypt");
const { users, wishlist } = require("../mongoConfig");
const CryptoJs = require("crypto-js");
const { sendMail } = require("../utils/mailer");
const { ObjectId } = require("mongodb");

const getUsers = () => {
  return users.find({}).toArray();
};
const register = async (req) => {
  const { email, phone, password } = req.body;
  const userData = await users.findOne({ $or: [{ email, phone }] });
  if (userData) {
    throw new Error("User already registered");
  }
  const salt = await genSalt();
  const hashedPass = await hash(password, salt);

  const data = await users.insertOne({
    ...req.body,
    address:[],
    trips: [],
    wishlist: [],
    password: hashedPass,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const date = new Date();
  const token = CryptoJs.AES.encrypt(
    JSON.stringify({
      expiry: date.getTime() + 24 * 3600 * 1000,
      userId: data.insertedId,
    }),
    process.env.CRYPTO_SECRET
  ).toString();
  sendMail(
    email,
    "Email Verification",
    `
        <h2>Verify Your Email</h2>
        <button style="color:green;">
        <a href="http://localhost:4000/verify_email/${token}" target="_blank">
        Verify Email
        </a>
        </button>    
    `
  );
  return data;
};

const login = async (req) => {
  const { email, phone, password } = req.body;
  const userData = await users.findOne({ $or: [{ email }, { phone }] });
  if (!userData) {
    throw new Error("Email/Phone not registered");
  }
  const { password: hashedPass } = userData;
  const checkPass = await compare(password, hashedPass);
  if (!checkPass) {
    throw new Error("Wrong Credentials");
  }
  const token = CryptoJs.AES.encrypt(
    JSON.stringify({ userId: userData._id, email: userData.email }),
    process.env.CRYPTO_SECRET
  ).toString();
  //const token = jwt.sign({userId:userData._id,email: userData.email},process.env.CRYPTO_SECRET)
  delete userData.password;
  return {
    ...userData,
    token,
  };
};

const verify_email = async (req) => {
  const { token } = req.params;
  const decryptedString = CryptoJs.AES.decrypt(
    token,
    process.env.CRYPTO_SECRET
  ).toString(CryptoJs.enc.Utf8);
  const { expiry, userId } = JSON.parse(decryptedString);
  const date = new Date();
  if (expiry < date.getTime()) {
    throw new Error("Link expired");
  }
  const _id = new ObjectId(userId);
  await users.findOneAndUpdate(
    { _id },
    {
      verified: true,
    }
  );
  return { data: "User Verified" };
};

const forgetPassword = async (req) => {
  const { email } = req.body;
  const userData = await users.findOne({ email });
  if (!userData) {
    throw new Error("Email not found");
  }
  const date = new Date();
  const token = CryptoJs.AES.encrypt(
    JSON.stringify({
      expiry: date.getTime() + 24 * 3600 * 1000,
      userId: userData._id,
    }),
    process.env.CRYPTO_SECRET
  ).toString();
  sendMail(
    email,
    "Password Reset Link",
    `
    <h2>Reset Your password</h2>
    <button style="color:green;">
    <a href="http://frontend.com/changePass/${token}" target="_blank">
    Reset Password
    </a>
    </button> 
    `
  );
  return {
    data: "Reset link sent"
  }
};

const changePass = async(req) => {
    const { token } = req.params;
    const {password} = req.body;
    const decryptedString = CryptoJs.AES.decrypt(
      token,
      process.env.CRYPTO_SECRET
    ).toString(CryptoJs.enc.Utf8);
    const { expiry, userId } = JSON.parse(decryptedString);
    const date = new Date();
    if (expiry < date.getTime()) {
      throw new Error("Link expired");
    }
    const salt = await genSalt();
    const hashedPass = await hash(password,salt);
    await users.findOneAndUpdate(
      { _id },
      {
        password: hashedPass,
      }
    );
    return { data: "password updated" };
}

const addToWishlist = async(req) => {
  const {hotelId} = req.params;
  const userId = new ObjectId(req.userId);
  await users.findOneAndUpdate({_id:userId},{
    $push: {
      wishlist: hotelId
    }
  });
  return {data: "Hotel added to wishlist"};
}
const removeFromWishlist = async(req) => {
  const {hotelId} = req.params;
  const userId = new ObjectId(req.userId);
  await users.findOneAndUpdate({_id:userId},{
    $pull: {
      wishlist: hotelId
    }
  });
  return {data: "Hotel removed to wishlist"};
}

module.exports = { getUsers, register, login, verify_email,forgetPassword,changePass, addToWishlist, removeFromWishlist };
