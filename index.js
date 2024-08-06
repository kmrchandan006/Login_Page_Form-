const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const val = require("./config");
const User = require("./model");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to the database
// val();

// app.use(cors({origin:"https://mobzway-1syl.onrender.com",}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect('mongodb+srv://kmrchandan006:chandan%40123@cluster0.dqtnskf.mongodb.net/project', { useNewUrlParser: true, useUnifiedTopology: true });

let usersInRoom = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (user) => {
    const { emailId, name } = user;
    console.log("User joining room:", emailId);

    // Update or add user to usersInRoom
    usersInRoom[emailId] = { emailId, socketId: socket.id, name };

    // Store user info in socket object
    socket.user = { emailId, name };

    socket.join("live_users");
    console.log(`${name} joined live_users room`);

    io.to("live_users").emit("updateUserList", usersInRoom);
    console.log("Emitting updateUserList event:", usersInRoom);
    console.log("Updated usersInRoom:", usersInRoom);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (socket.user) {
      // Mark user as offline instead of removing
      usersInRoom[socket.user.emailId].socketId = null;
      io.to("live_users").emit("updateUserList", usersInRoom);
      console.log("Emitting updateUserList event:", usersInRoom);
      console.log("Updated usersInRoom after disconnect:", usersInRoom);
    }
  });
});

app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.validate();
    await user.save();

    const userData = {
      emailId: user.emailId,
      name: `${user.firstName} ${user.lastName}`,
      socketId: null,
    };

    usersInRoom[user.emailId] = userData;
    console.log("User saved and added to room:", userData);
    console.log("Current usersInRoom:", usersInRoom);

    io.emit("userAdded", userData);
    io.to("live_users").emit("updateUserList", usersInRoom);
    console.log("Emitting updateUserList event:", usersInRoom);

    res.status(201).send(user);
  } catch (error) {
    const errorMessages = {};
    if (error.errors) {
      for (const key in error.errors) {
        errorMessages[key] = error.errors[key].message;
      }
    } else {
      errorMessages.general = error.message;
    }
    res
      .status(400)
      .send({ message: "Error saving user", errors: errorMessages });
  }
});

app.get("/api/users/:emailId", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.params.emailId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error fetching user", error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
