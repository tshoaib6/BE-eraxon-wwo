import { Request, Response } from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'
import Payment from '../models/payment.model' // Import the Invoice model
import User from '../models/user.model' // Import User model
import Invoice from '../models/invoice.model' // Import the Invoice model
import PlanDetails from '../models/planDetails.model'

dotenv.config() // Load environment variables

const clientId =
  'Acr0HOOTM9BY5YKTEg2GxVEdMqiK4RmKPPWI72Ue0TNUm6IawIYz4utuuZVZLNni8xldmWzFXOVu5Qpz'
const secretKey =
  'ECOd4Mq6vyxJOiDTy_UcJbfJn9bhiKlkaetU-Rkjqj59oSQUHb6FSlRhtwKFYRGo2PR9EVV_bXVtQRLb'

// Helper function to get PayPal access token
const getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${clientId}:${secretKey}`).toString('base64')
  try {
    const response = await axios.post(
      'https://api.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    return response.data.access_token
  } catch (error: any) {
    console.error(
      'Error retrieving PayPal access token:',
      error.response?.data || error.message
    )
    throw new Error('Failed to retrieve PayPal access token')
  }
}

export const createPayPalPayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, planId } = req.body

    // Check if planId is provided
    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' })
    }

    // Token check and decoding for user verification
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' })
    }

    let tokenPayload
    try {
      tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Error decoding token', error: error.message })
    }

    const userId = extractUserIdFromToken(tokenPayload)

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Create a payment
    const paymentData = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      transactions: [
        {
          amount: {
            total: amount,
            currency: currency || 'USD'
          },
          description: 'Payment description'
        }
      ],
      redirect_urls: {
        return_url: process.env.FRONT_END_URL, // User will be redirected here after approval
        cancel_url: process.env.FRONT_END_URL
      }
    }

    const response = await axios.post(
      'https://api.sandbox.paypal.com/v1/payments/payment',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    // Log the PayPal response for debugging
    console.log('PayPal API Response:', response.data)

    // Get the approval URL to redirect the user to PayPal
    const approvalUrl = response.data.links.find(
      (link: any) => link.rel === 'approval_url'
    )?.href

    if (!approvalUrl) {
      return res
        .status(500)
        .json({ message: 'Approval URL not found in the PayPal response' })
    }

    // Save the payment details to the database
    const paymentDetails = new Payment({
      paymentId: response.data.id, // PayPal payment ID
      payerId: response.data.payer.payer_info?.payer_id || 'unknown',
      user: userId, // User reference
      amount: amount,
      currency: currency || 'USD',
      paymentStatus: 'completed', // Initial status
      payerEmail: response.data.payer.payer_info?.email || 'unknown',
      transactionId:
        response.data.transactions[0]?.related_resources?.[0]?.sale?.id || '',
      createdAt: new Date(),
      plan: planId // Added planId here
    })

    await paymentDetails.save()

    // Fetch plan details
    const plan = await PlanDetails.findById(planId)
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan ID' })
    }

    // Generate invoice after successful payment
    const invoice = new Invoice({
      invoiceId: `INV-${new Date().getTime()}`, // Generate unique invoice ID
      user: userId,
      subscriptionDate: new Date(),
      subscriptionEndDate: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ),
      planName: plan.planName,
      planPrice: plan.planPrice
    })

    // Save the generated invoice
    await invoice.save()

    // Send the approval URL and invoice back to the frontend
    return res.status(200).json({
      message: 'Payment created successfully',
      approvalUrl,
      invoice // Include the invoice in the response
    })
  } catch (error: any) {
    console.error('Error creating PayPal payment:', error)
    return res
      .status(500)
      .json({ message: 'Error creating PayPal payment', error: error.message })
  }
}

// updated code for planId invoice as well user paymentStatus
export const capturePayPalPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, payerId } = req.body

    if (!paymentId || !payerId) {
      return res.status(400).json({ message: 'Payment ID or Payer ID missing' })
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Execute payment on PayPal
    const response = await axios.post(
      `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
      { payer_id: payerId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    // Token check and decoding for user verification
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' })
    }

    let tokenPayload
    try {
      tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Error decoding token', error: error.message })
    }

    const userId = extractUserIdFromToken(tokenPayload)
    // Update the payment in your database
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId: paymentId },
      {
        paymentStatus: 'completed',
        payerId: payerId,
        payerEmail: response.data.payer.payer_info.email,
        transactionId:
          response.data.transactions[0].related_resources[0].sale.id
      },
      { new: true }
    )

    const user = await User.findById(userId)
    if (user) {
      user.paymentStatus = 'paid' // Update the user's payment status
      await user.save()
    }

    return res.status(200).json({
      success: true,
      message: 'Payment successfully captured and user payment status updated',
      paymentDetails: updatedPayment
    })
  } catch (error: any) {
    console.error('Error capturing PayPal payment:', error)
    return res
      .status(500)
      .json({ message: 'Error capturing PayPal payment', error: error.message })
  }
}

const luhnCheck = (cardNumber: string) => {
  // Ensure cardNumber is a valid string and has a length
  if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
    return false // Invalid card number
  }

  let sum = 0
  let shouldDouble = false

  // Iterate over the digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10)

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  // Return true if sum is divisible by 10
  return sum % 10 === 0
}

export const createCardPayment = async (req: Request, res: Response) => {
  try {
    const { fullName, cardNumber, expiryDate, addressOrTaxId, planId } =
      req.body

    // Ensure cardNumber is provided and valid
    if (
      !cardNumber ||
      typeof cardNumber !== 'string' ||
      cardNumber.length === 0
    ) {
      return res
        .status(400)
        .json({ message: 'Card number is required and cannot be empty' })
    }

    // Token check and decoding for user verification
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' })
    }

    let tokenPayload
    try {
      tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Error decoding token', error: error.message })
    }

    const userId = extractUserIdFromToken(tokenPayload)

    // Validate card number using Luhn Algorithm
    if (!luhnCheck(cardNumber)) {
      return res.status(400).json({ message: 'Invalid card number' })
    }

    // Validate expiry date
    const [month, year] = expiryDate.split('/').map(Number)
    const now = new Date()
    const expiry = new Date(`20${year}-${month.toString().padStart(2, '0')}-01`)
    if (expiry <= now) {
      return res.status(400).json({ message: 'Invalid or expired expiry date' })
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()
    if (!accessToken) {
      return res
        .status(400)
        .json({ message: 'Unable to retrieve PayPal access token' })
    }

    // Create a payment on PayPal
    const paymentData = {
      intent: 'sale',
      payer: {
        payment_method: 'credit_card',
        funding_instruments: [
          {
            credit_card: {
              number: cardNumber,
              type: 'visa', // Update dynamically based on card type
              expire_month: month,
              expire_year: `20${year}`, // Fixed template literal usage
              cvv2: '123', // Collect securely
              first_name: fullName.split(' ')[0],
              last_name: fullName.split(' ')[1] || '',
              billing_address: {
                line1: addressOrTaxId || 'No Address Provided',
                city: 'Unknown',
                state: 'Unknown',
                postal_code: '00000',
                country_code: 'US'
              }
            }
          }
        ]
      },
      transactions: [
        {
          amount: {
            total: '10.00',
            currency: 'USD'
          },
          payee: { email: 'sb-jfler34872293@business.example.com' }, // Replace with a valid merchant account
          description: 'Payment using credit or debit card'
        }
      ]
    }

    // Sending request to PayPal API
    const response = await axios.post(
      'https://api.sandbox.paypal.com/v1/payments/payment',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}` // Fixed template literal usage
        }
      }
    )

    // Log the PayPal response for debugging
    console.log('PayPal API Response:', response.data)

    // Check for successful payment creation
    if (response.data.state === 'approved') {
      return res.status(200).json({
        message: 'Payment approved successfully',
        paymentDetails: response.data
      })
    } else {
      return res.status(400).json({
        message: 'Payment creation failed',
        error: response.data
      })
    }
  } catch (error: any) {
    console.error('Error creating card payment:', error)
    return res
      .status(500)
      .json({ message: 'Error creating card payment', error: error.message })
  }
}

// Capture payment if necessary
export const captureCardPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' })
    }

    const accessToken = await getPayPalAccessToken()

    const response = await axios.post(
      `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    // Update the payment in the database
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId },
      {
        paymentStatus: 'completed'
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Payment successfully captured',
      paymentDetails: updatedPayment
    })
  } catch (error: any) {
    console.error('Error capturing card payment:', error)
    return res.status(500).json({
      message: 'Error capturing card payment',
      error: error.message
    })
  }
}

export const getPaypalPaymentHistory = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' })
    }

    let tokenPayload
    try {
      tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Error decoding token', error: error.message })
    }

    const userId = extractUserIdFromToken(tokenPayload)

    // Fetch the payments, populate plan and user fields
    const payments = await Payment.find({ user: userId })
      .populate('plan') // Populate the plan details
      .populate({
        path: 'user', // Populate the user details
        select: 'firstName lastName email' // Only include these fields
      })

    // Fetch the invoices
    const invoices = await Invoice.find({ user: userId })

    // Fetch user details directly to include paymentStatus
    const user = await User.findById(userId)
    const userPaymentStatus = user ? user.paymentStatus : 'unpaid' // Default to "unpaid" if user is not found

    if (!payments || payments.length === 0) {
      return res
        .status(404)
        .json({ message: 'No payments found for this user' })
    }

    return res.status(200).json({
      message: 'Payment and invoice history retrieved successfully',
      payments, // Includes populated plan and user details
      invoices,
      userPaymentStatus // Include user payment status
    })
  } catch (error: any) {
    console.error('Error retrieving payment history:', error)
    return res.status(500).json({
      message: 'Error retrieving payment history',
      error: error.message
    })
  }
}

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' })
    }

    let tokenPayload
    try {
      tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Error decoding token', error: error.message })
    }

    const userId = extractUserIdFromToken(tokenPayload)

    // Find the user's payment and update the status
    const payment = await Payment.findOne({ user: userId })
    if (!payment) {
      return res.status(404).json({ message: 'No active subscription found' })
    }

    // Update the user's payment status to "unpaid"
    const user = await User.findById(userId)
    if (user) {
      user.paymentStatus = 'unpaid'
      await user.save()
    }

    return res
      .status(200)
      .json({ message: 'Subscription canceled successfully' })
  } catch (error: any) {
    console.error('Error canceling subscription:', error)
    return res.status(500).json({
      message: 'Error canceling subscription',
      error: error.message
    })
  }
}





