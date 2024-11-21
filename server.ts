import app from './app';
import redis from './redis';
import mongoose from 'mongoose';
import cors from 'cors';
const express = require('express');
import { Request, Response } from 'express';



const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

mongoose.connect(dbUrl)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.error('Failed to connect to MongoDB', err);
  });
