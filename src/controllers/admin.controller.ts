import { Request, Response } from 'express';
import User from '../models/user.model'; // Adjust the path if needed

// Controller to fetch all users for the admin panel
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users and populate the required fields
    const users = await User.find({}, 'profilePic firstName lastName email isActive');

    return res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      message: 'Failed to fetch users. Please try again later.',
    });
  }
};

// Controller to update a user's active status
// export const updateUserStatus = async (req: Request, res: Response) => {
//     try {
//       // Step 1: Extract token from request headers or cookies
//       const token =
//         req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({ message: "Authorization token is required" });
//       }
  
//       // Step 2: Decode the token and extract the user ID and email
//       const tokenPayload = JSON.parse(
//         Buffer.from(token.split(".")[1], "base64").toString()
//       );
//       const userId = tokenPayload.userId;  // Extracting userId from the token payload
//       const email = tokenPayload.email;    // Extracting email from the token payload
  
//       // Step 3: Extract isActive status from the request body
//       const { isActive } = req.body;
//       if (typeof isActive !== 'boolean') {
//         return res.status(400).json({
//           message: 'Invalid status value. It must be a boolean.',
//         });
//       }
  
//       // Step 4: Find the user and update their status based on the extracted userId
//       const user = await User.findByIdAndUpdate(
//         userId,
//         { isActive },
//         { new: true, runValidators: true } // Return the updated document
//       ).select('profilePic firstName lastName email isActive');
  
//       if (!user) {
//         return res.status(404).json({
//           message: 'User not found',
//         });
//       }
  
//       // Step 5: Return the updated user details with the new status
//       return res.status(200).json({
//         message: 'User status updated successfully',
//         user,
//       });
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       return res.status(500).json({
//         message: 'Failed to update user status. Please try again later.',
//       });
//     }
//   };



export const updateUserStatus = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
  
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Invalid status value. It must be a boolean.' });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true, runValidators: true }
      ).select('profilePic firstName lastName email isActive');
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({
        message: 'User status updated successfully',
        user: updatedUser,
      });
      
    } catch (error) {
      console.error('Error updating user status:', error);
      return res.status(500).json({
        message: 'Failed to update user status. Please try again later.',
      });
    }
  };


  export const deleteUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params; // Extract userId from the URL params
  
      // Find and delete the user
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        message: 'Failed to delete user. Please try again later.',
      });
    }
  };