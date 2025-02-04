import { Request, Response } from 'express';
import Payment from '../models/paymentDetails.model';
import PlanDetails from '../models/planDetails.model';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';
import User from '../models/user.model'; // Import User model
import Invoice from '../models/invoice.model'; // Import the Invoice model

// export const createPayment = async (req: Request, res: Response) => {
//   try {
//     const { fullName = "", cardNumber = "", expiryDate = "", cvv = "", addressOrTaxId = "", planId = "" } = req.body;

//     // Optional fields will be empty if not provided
//     if (!planId) {
//       return res.status(400).json({ message: 'Plan ID is required' });
//     }

//     // Extract token from headers and decode to get userId
//     const token =
//       req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Authorization token is required" });
//     }

//     console.log("Received token:", token);  // Log token to debug

//     // Extract userId from token payload
//     let tokenPayload;
//     try {
//       tokenPayload = JSON.parse(
//         Buffer.from(token.split(".")[1], "base64").toString()
//       );
//     } catch (error:any) {
//       return res.status(500).json({ message: "Error decoding token", error: error.message });
//     }

//     const userId = extractUserIdFromToken(tokenPayload);  // Extract userId from token
//     console.log("Decoded token:", tokenPayload);  // Log decoded token for debugging

//     // Check if the planId exists in the PlanDetails collection
//     const plan = await PlanDetails.findById(planId);
//     if (!plan) {
//       return res.status(400).json({ message: 'Invalid plan ID' });
//     }

//     // Create a new payment record with the extracted userId
//     const newPayment = new Payment({
//       fullName,
//       cardNumber,
//       expiryDate,
//       cvv,
//       addressOrTaxId,
//       user: userId,  // Use the extracted userId
//       plan: planId,  // Reference to the selected plan
//     });

//     // Save the payment to the database
//     const savedPayment = await newPayment.save();
//     const user = await User.findById(userId);
//     if (user) {
//       user.paymentStatus = 'paid'; // Update the payment status
//       await user.save(); // Save the updated user
//     }
//     return res.status(201).json({ message: 'Payment created successfully', payment: savedPayment });
//   } catch (error: any) {
//     console.error('Error creating payment:', error);  // Log the error for debugging
//     return res.status(500).json({ message: 'Error creating payment', error: error.message });
//   }
// };



// export const createPayment = async (req: Request, res: Response) => {
//   try {
//     const { fullName = "", cardNumber = "", expiryDate = "", cvv = "", addressOrTaxId = "", planId = "" } = req.body;

//     // Check if planId is provided
//     if (!planId) {
//       return res.status(400).json({ message: 'Plan ID is required' });
//     }

//     // Token check and decoding for user verification
//     const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Authorization token is required" });
//     }

//     let tokenPayload;
//     try {
//       tokenPayload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
//     } catch (error: any) {
//       return res.status(500).json({ message: "Error decoding token", error: error.message });
//     }

//     const userId = extractUserIdFromToken(tokenPayload); // This function should extract userId from the decoded token

//     // Fetch plan details based on planId
//     const plan = await PlanDetails.findById(planId);
//     if (!plan) {
//       return res.status(400).json({ message: 'Invalid plan ID' });
//     }

//     // Create a new Payment record without the paymentStatus field
//     const newPayment = new Payment({
//       fullName,
//       cardNumber,
//       expiryDate,
//       cvv,
//       addressOrTaxId,
//       user: userId,
//       plan: planId,
//       // Don't add paymentStatus here as it's tracked in the User model
//     });

//     // Save the payment record
//     const savedPayment = await newPayment.save();

//     // Fetch user and update payment status to 'paid'
//     const user = await User.findById(userId);
//     if (user) {
//       user.paymentStatus = 'unpaid'; // Update the user's payment status
//       await user.save();
//     }

//     // Generate invoice after successful payment
//     const invoice = new Invoice({
//       invoiceId: `INV-${new Date().getTime()}`, // Generate unique invoice ID
//       user: userId,
//       subscriptionDate: new Date(), // Set subscription date as current date
//       subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Set subscription end date 1 month after the current date
//       planName: plan.planName,
//       planPrice: plan.planPrice,
//     });

//     // Save the generated invoice
//     await invoice.save();

//     return res.status(201).json({ message: 'Payment created successfully', payment: savedPayment, invoice });
//   } catch (error: any) {
//     console.error('Error creating payment:', error);
//     return res.status(500).json({ message: 'Error creating payment', error: error.message });
//   }
// };



// export const getPaymentDetails = async (req: Request, res: Response) => {
//   try {
//     // Extract token from headers or cookies to authenticate user
//     const token =
//       req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Authorization token is required" });
//     }

//     // Decode token to extract userId
//     let tokenPayload;
//     try {
//       tokenPayload = JSON.parse(
//         Buffer.from(token.split(".")[1], "base64").toString()
//       );
//     } catch (error: any) {
//       return res.status(500).json({ message: "Error decoding token", error: error.message });
//     }

//     const userId = extractUserIdFromToken(tokenPayload); // Extract userId from token payload

//     // Fetch payments for the authenticated user and populate plan details
//     const payments = await Payment.find({ user: userId }).populate("plan");

//     // If no payments are found, return an appropriate response
//     if (!payments || payments.length === 0) {
//       return res.status(404).json({ message: "No payments found for this user" });
//     }

//     return res.status(200).json({
//       message: "Payments retrieved successfully",
//       payments, // Includes plan details due to populate
//     });
//   } catch (error: any) {
//     console.error("Error retrieving payment details:", error); // Log error for debugging
//     return res.status(500).json({
//       message: "Error retrieving payment details",
//       error: error.message,
//     });
//   }
// };



export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    let tokenPayload;
    try {
      tokenPayload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
    } catch (error: any) {
      return res.status(500).json({ message: "Error decoding token", error: error.message });
    }

    const userId = extractUserIdFromToken(tokenPayload);

    // Find the user's payment and update the status
    const payment = await Payment.findOne({ user: userId });
    if (!payment) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    // Update the user's payment status to "unpaid"
    const user = await User.findById(userId);
    if (user) {
      user.paymentStatus = "unpaid";
      await user.save();
    }

    return res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error: any) {
    console.error("Error canceling subscription:", error);
    return res.status(500).json({
      message: "Error canceling subscription",
      error: error.message,
    });
  }
};
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    let tokenPayload;
    try {
      tokenPayload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    } catch (error: any) {
      return res.status(500).json({ message: "Error decoding token", error: error.message });
    }

    const userId = extractUserIdFromToken(tokenPayload);

    // Fetch the payments, populate plan and user fields
    const payments = await Payment.find({ user: userId })
      .populate("plan") // Populate the plan details
      .populate({
        path: "user", // Populate the user details
        select: "firstName lastName email", // Only include these fields
      });

    // Fetch the invoices
    const invoices = await Invoice.find({ user: userId });

    // Fetch user details directly to include paymentStatus
    const user = await User.findById(userId);
    const userPaymentStatus = user ? user.paymentStatus : "unpaid"; // Default to "unpaid" if user is not found

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this user" });
    }

    return res.status(200).json({
      message: "Payment and invoice history retrieved successfully",
      payments, // Includes populated plan and user details
      invoices,
      userPaymentStatus, // Include user payment status
    });
  } catch (error: any) {
    console.error("Error retrieving payment history:", error);
    return res.status(500).json({
      message: "Error retrieving payment history",
      error: error.message,
    });
  }
};

