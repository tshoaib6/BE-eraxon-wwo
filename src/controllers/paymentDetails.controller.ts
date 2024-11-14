import { Request, Response } from 'express';
import Payment from '../models/paymentDetails.model';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { fullName, cardNumber, expiryDate, cvv, addressOrTaxId, userId } = req.body;

    // Create a new payment record
    const newPayment = new Payment({
      fullName,
      cardNumber,
      expiryDate,
      cvv,
      addressOrTaxId,
      user: userId || undefined, // Optional user reference
    });

    // Save the payment to the database
    const savedPayment = await newPayment.save();
    return res.status(201).json({ message: 'Payment created successfully', payment: savedPayment });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};
