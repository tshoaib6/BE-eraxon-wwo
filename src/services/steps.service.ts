import Step, { StepData } from '../models/stepform.model';

export const createOrUpdateStepService = async (stepData: Partial<StepData>) => {
  const existingStep = await Step.findOne({ userId: stepData.userId });

  if (existingStep) {
    // Update existing step
    Object.assign(existingStep, stepData);
    const updatedStep = await existingStep.save();
    console.log("Updated step:", updatedStep);
    return updatedStep;
  } else {
    // Create new step
    const newStep = new Step(stepData);
    console.log("New step created:", newStep);
    const savedStep = await newStep.save();
    return savedStep;
  }
};


