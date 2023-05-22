// const express = require("express");
// const { open } = require("sqlite");
// const path = require("path");
// const sqlite3 = require("sqlite3");
// const bcrypt = require("bcrypt");
// const app = express();

// app.use(express.json());
// const dBPath = path.join(__dirname, "userData.db");

// let db = null;
// const initializeDBServer = async () => {
//   try {
//     db = await open({
//       filename: dBPath,
//       driver: sqlite3.Database,
//     });
//     app.listen(3000, () => {
//       console.log("Server Running at http://localhost:3000/");
//     });
//   } catch (e) {
//     console.log(`DB Error:${e.message}`);
//     process.exit(1);
//   }
// };
// initializeDBServer();

// app.post("/register", async (request, response) => {
//   const { username, name, password, gender, location } = request.body;
//   const hashPassword = await bcrypt.hash(password, 10);
//   const selectQuery = `SELECT * FROM user WHERE
//     username=${username}`;
//   const dBUser = await db.get(selectQuery);
//   if (dbUser === undefined) {
//     const createUserQuery = `
//         INSERT INTO
//         user(username,name,password,gender,location)
//         VALUES
//         (
//             "${username}",
//             "${name}",
//             "${password}",
//             "${gender}",
//             "${location}"
//         )`;
//     if (password.length > 4) {
//       await db.run(createUserQuery);
//       response.send("User created successfully");
//     } else {
//       response.status(400);
//       response.send("Password is too short");
//     }
//   } else {
//     response.status(400);
//     response.send("User already exists");
//   }
// });
// //API 2
// app.post("/login", async (request, response) => {
//   const selectQuery = `SELECT * FROM user WHERE
//     username = ${username}`;
//   const dBUser = await db.get(selectQuery);
//   if (dBUser === undefined) {
//     response.status(400);
//     response.send("Invalid User");
//   } else {
//     const isPasswordMatched = await bcrypt.compare(password, dBUser.password);
//     if (isPasswordMatched === true) {
//       response.send("Login success!");
//     } else {
//       response.status(400);
//       response.send("Invalid Password");
//     }
//   }
// });

// //API3
// app.put("/change-password", async (request, response) => {
//   const { username, oldPassword, newPassword } = request.body;
//   const selectQuery = `SELECT * FROM user
//     WHERE username = ${username}`;
//   const dBUser = await db.get(selectQuery);
//   if (dBUser === undefined) {
//     response.status(400);
//     response.send("User not registered");
//   } else {
//     const isPasswordMatched = await bcrypt.compare(
//       oldPassword,
//       dBUser.password
//     );
//     if (isPasswordMatched === true) {
//       const lengthOfPassword = newPassword.length;
//       if (lengthOfPassword < 5) {
//         response.status(400);
//         response.send("Password is too short");
//       } else {
//         const encryptedPassword = await bcrypt.hash(newPassword, 10);
//         const updatedPassword = `UPDATE
//                 user
//                 SET password = '${encryptedPassword}'
//                 WHERE username = ${username}`;
//         await db.run(updatedPassword);
//         response.send("Password updated");
//       }
//     } else {
//       response.status(400);
//       response.send("Invalid current password");
//     }
//   }
// });
// module.exports = app;
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "userData.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//API 1
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `
    SELECT * FROM user WHERE username='${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
        INSERT INTO 
        user(username,name,password,gender,location)
        VALUES 
        (
            '${username}',
            '${name}',
            '${hashedPassword}',
            '${gender}',
            '${location}'
        )`;
    if (password.length > 4) {
      await db.run(createUserQuery);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});
//API 2
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username='${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});
//API 3
app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username='${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("User not registered");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      dbUser.password
    );
    if (isPasswordMatched === true) {
      const lengthOfPassword = newPassword.length;
      if (lengthOfPassword < 5) {
        response.status(400);
        response.send("Password is too short");
      } else {
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updateNewPassword = `
             UPDATE 
                user 
             SET 
               password='${encryptedPassword}'
             WHERE 
               username='${username}';`;
        await db.run(updateNewPassword);
        response.send("Password updated");
      }
    } else {
      response.status(400);
      response.send("Invalid current password");
    }
  }
});
module.exports = app;
