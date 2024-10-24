import Step, { StepData } from '../models/stepform.model';

export const createOrUpdateStepService = async (stepData: StepData) => {
  const existingStep = await Step.findOne({ userId: stepData.userId });
  
  if (existingStep) {
    Object.assign(existingStep, stepData);
    return await existingStep.save();
  } else {
    const newStep = new Step(stepData);
    return await newStep.save();
  }
};

