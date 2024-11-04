import { Request, Response } from 'express';
import Payment from '../models/payment.model';

export const createPayment = async (req: Request, res: Response) => {
  const { fullName, cardDetails, expiryDate, cvv, address, taxId } = req.body;

  try {
    const payment = new Payment({
    //   userId: req.user.id, // Assuming you have middleware that sets req.user
      fullName,
      cardDetails,
      expiryDate,
      cvv,
      address,
      taxId,
    });

    await payment.save();
    res.status(201).json({ message: 'Payment details saved successfully', payment });
  } catch (error: any) {
    res.status(500).json({ message: 'Error saving payment details', error: error.message });
  }
};
