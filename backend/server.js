const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const foodFavoriteRoutes = require("./routes/foodFavoriteRoutes");
const addressRoutes = require("./routes/addressRoutes");

const app = express();

const server = http.createServer(app);


/* =========================
   SOCKET.IO
========================= */

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  },
});

app.set("io", io);


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());


/* =========================
   DATABASE
========================= */

connectDB();


/* =========================
   BASIC ROUTES
========================= */

app.get("/", (req, res) => {
  res.send(
    "BiteRush Backend is running!"
  );
});

app.get("/api/test", (req, res) => {
  res.json({
    message:
      "BiteRush API is working!",
  });
});


/* =========================
   API ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/restaurants",
  restaurantRoutes
);

app.use(
  "/api/foods",
  foodRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/favorites",
  favoriteRoutes
);

app.use(
  "/api/food-favorites",
  foodFavoriteRoutes
);

app.use(
  "/api/addresses",
  addressRoutes
);


/* =========================
   SOCKET.IO EVENTS
========================= */

io.on("connection", (socket) => {
  console.log(
    `Socket connected: ${socket.id}`
  );


  socket.on(
    "joinOrderRoom",
    (orderId) => {
      socket.join(
        `order_${orderId}`
      );

      console.log(
        `Socket ${socket.id} joined order_${orderId}`
      );
    }
  );


  socket.on("disconnect", () => {
    console.log(
      `Socket disconnected: ${socket.id}`
    );
  });
});


/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});