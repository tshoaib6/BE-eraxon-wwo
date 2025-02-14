import { Request, Response } from 'express';
import PlanDetails from '../models/planDetails.model';

// POST API - Create a new Plan
export const createPlan = async (req: Request, res: Response) => {
  try {
    const { planName, planPrice,planDesc, planFeatures } = req.body;

    // Create a new plan
    const newPlan = new PlanDetails({
      planName,
      planPrice,
      planDesc,
      planFeatures
    });

    // Save the plan to the database
    const savedPlan = await newPlan.save();
    return res.status(201).json({ message: 'Plan created successfully', plan: savedPlan });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error creating plan', error: error.message });
  }
};

// GET API - Get all plans (No token required)
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    // Fetch all plans from the database
    const plans = await PlanDetails.find();
    return res.status(200).json({ plans });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
};
