#!/usr/bin/env node
/**
 * Reset a user's password from the command line.
 * Usage: node resetPassword.js user@example.com NewP@ssw0rd
 *
 * This script reads MONGO_URI from backend/.env (via dotenv).
 * It safely hashes the new password with bcrypt and updates the user document.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Adjust path to model relative to this script
import User from '../models/User.js';

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error('Usage: node resetPassword.js <userEmail> <newPassword>');
    process.exit(1);
  }

  const [email, newPassword] = args;
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    console.error('New password must be a string with at least 6 characters.');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not found in backend/.env. Please set it before running this script.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found with email: ${email}`);
      process.exit(1);
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashed;
    await user.save();

    console.log(`Password for ${email} has been reset successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err.message || err);
    process.exit(1);
  }
}

main();
