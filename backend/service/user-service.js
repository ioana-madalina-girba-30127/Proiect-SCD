import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  let createdUser;
  try {
    const users = await User.find().exec();
    const VALID = users.find((u) => u.email === email);

    if (VALID)
      // se verifica daca email-ul introdus exista in baza de date si daca corespunde cu parola
      return res.json({
        message: "Email already used!",
      });

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 5); // criptarea parolei
    } catch (err) {
      res.status(500).json({
        error: "Could not create user.",
      });
    }

    createdUser = new User({
      email,
      password: hashedPassword,
    });

    await createdUser.save();
  } catch (err) {
    res.status(500).json("Registration has failed!", err);
  }

  let token;
  try {
    token = jwt.sign(
      { userID: createdUser.id, email: createdUser.email },
      "super_secret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.json("Failed registration!", err);
  }
  res.status(201).json({
    message: "New user added!",
    user: { ...createdUser._doc, password: "" },

    accessToken: token,
  });
};

export const updateUserPassword = async (req, res) => {
  const userID = req.params.uid;
  const { currentPassword, newPassword } = req.body;

  let user;
  try {
    user = await User.findById(userID);
  } catch (err) {
    return res.status(500).json("Error! Could not update password. ");
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(currentPassword, user.password);
  } catch (error) {
    return res.status(500).json("Edit failed, please try again later.");
  }
  if (!isValidPassword) {
    return res.status(401).json("Wrong password!");
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 5); // criptarea parolei
  } catch (err) {
    res.status(500).json({
      error: "Could not edit password.",
    });
  }

  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    return res.status(500).json("Could not update password! ");
  }
  return res.status(200).json({
    message: "Password updated!",
  });
};

export const loginUser = async (req, res) => {
  //functie care logheaza un utilizator existent cerand un email si o parola

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email,
    }); //transformarea continutului din baza de date intr-un array de obiecte

    if (!existingUser)
      // se verifica daca email-ul introdus exista in baza de date si daca corespunde cu parola
      return res.status(401).json({
        message: "No account found .",
      }); //mesaj de eroare , nu se mai executa functia in continuare
  } catch (error) {
    return res.json({
      error,
    });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return res.status(500).json("Login failed, please try again later.");
  }

  if (!isValidPassword) {
    return res.status(401).json("Wrong password.");
  }

  let token;
  try {
    token = jwt.sign(
      { userID: existingUser.id, username: existingUser.email },
      "super_secret",
      { expiresIn: "5h" }
    );
  } catch (err) {
    return res.status(500).json("Login failed!");
  }

  res.json({
    message: "Welcome back, " + existingUser.email + "!",
    user: { ...existingUser._doc, password: "" },
    accessToken: token,
  }); // mesaj in caz de succes
};
