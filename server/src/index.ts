
import { app } from "./app.js";
import { initDB } from "./db/db.init.js";

const PORT = process.env.PORT;

initDB().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT || 3000}`);
  }),
);
