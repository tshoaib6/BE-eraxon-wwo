import express from 'express';
import { createOrUpdateStep,getStep,getRecordById,getStepDataByUserID,searchAndSortRecords } from '../controllers/steps.controller';
import verifyJwt from '../middleware/verifyJwt';
import { stepFormUpload } from '../middleware/stepForm'; // Ensure this import matches the export

const router = express.Router();

router.post('/steps', verifyJwt, stepFormUpload, createOrUpdateStep);
router.get('/getStepsData', getStep);
router.get('/steps/record/:recordId', getRecordById);
router.get('/getStepDataByUserID', getStepDataByUserID);
router.get('/obituaries', searchAndSortRecords);


export default router;































// import React, { useState } from "react";
// import Input from "../../../components/Input/Input";
// import Button from "../../../components/Button/Button";
// import {
//   FormContainer,
//   FormGrid,
//   CenteredButton,
// } from "./ObituaryFilter.styles";

// interface ObituaryFilterProps {
//   onSubmit: (filters: any) => void;
// }

// const ObituaryFilter: React.FC<ObituaryFilterProps> = ({ onSubmit }) => {
//   const [filters, setFilters] = useState({
//     nameOfDeceased: "",
//     country: "",
//     city: "",
//     year: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(filters); // Pass the updated filters to the parent component
//   };

//   return (
//     <FormContainer onSubmit={handleSubmit}>
//       <FormGrid>
//         <Input
//           label="Name of Deceased"
//           name="nameOfDeceased"
//           type="text"
//           value={filters.nameOfDeceased} // Make sure the value is tied to state
//           onChange={handleInputChange} // Handle input change correctly
//         />
//         <Input
//           label="Country"
//           name="country"
//           type="text"
//           value={filters.country} // Make sure the value is tied to state
//           onChange={handleInputChange} // Handle input change correctly
//         />
//         <Input
//           label="City"
//           name="city"
//           type="text"
//           value={filters.city} // Make sure the value is tied to state
//           onChange={handleInputChange} // Handle input change correctly
//         />
//         <Input
//           label="Year"
//           name="year"
//           type="text"
//           value={filters.year} // Make sure the value is tied to state
//           onChange={handleInputChange} // Handle input change correctly
//         />
//         <CenteredButton>
//           <Button type="submit" label="Search" />
//         </CenteredButton>
//       </FormGrid>
//     </FormContainer>
//   );
// };

// export default ObituaryFilter;

