import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import { mintTokens } from "../services/tokenService.js";// optional, if using ERC20

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";
import Transaction from "../models/Transaction.js";

export async function registerUser(req, res) {
  try {
    const { fullName, email, password, role, accountAddress } = req.body;

    if (!fullName || !email || !password || !accountAddress) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      fullName,
      email,
      passwordHash,
      role: role || "Student",
      accountAddress,
    });

    // 🔹 Skipping blockchain mint for now
    // const txHash = await mintTokens(accountAddress, 100);

    // Create transaction account in DB with initial 100 tokens
    await Transaction.create({
      userId: newUser._id,
      balance: 100,
      history: [
        {
          type: "credit",
          amount: 100,
          description: "Initial token reward for registration",
          date: new Date(),
          // txHash,  // optional when you enable blockchain
        },
      ],
    });

    return res.status(201).json({
      message: "User registered successfully with 100 tokens",
      user: newUser,
      // transaction: txHash, // keep commented for now
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
}


// -------- Login User --------
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
}
