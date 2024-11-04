import { Request, Response } from 'express';
import PlanDetails from '../models/plansDetails.model';

// Controller to create a new plan
export const createPlan = async (req: Request, res: Response) => {
  try {
    const { name, price, mediaUploads, features } = req.body;

    // Ensure features is provided as an array of objects
    const newPlan = new PlanDetails({
      name,
      price,
      mediaUploads,
      features, // features should be an array of objects in the request body
    });

    const savedPlan = await newPlan.save().catch(error => console.error("Validation error:", error));
    res.status(201).json({ message: 'Plan created successfully', plan: savedPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating plan', error });
  }
};

// Controller to get all plans
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await PlanDetails.find();
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving plans', error });
  }
};
