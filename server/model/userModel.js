import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
   fname: {
    type: String,
    required: true
  },
   lname: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
   password:{
        type: String,
        required: true
    },
});


export default mongoose.model("User", userSchema);

// module.exports = User;
