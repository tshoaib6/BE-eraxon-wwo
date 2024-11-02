import Community from "../models/community.model"; // Adjust the path as needed
import { Request, Response } from "express";
import Post from "../models/post.model"; // Import the Post model

export const getAllCommunities = async (
  req: Request,
  res: Response,
  err: any
) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    const err = error as Error; // Type assertion to ensure error is treated as an Error object
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};



// without cursor pagination 

// export const getPostsByCommunityId = async (req: Request, res: Response) => {
//   try {
//     const { communityId } = req.params;

//     // If communityId is provided, find posts by communityId
//     if (communityId) {
//       const posts = await Post.find({ communityId });

//       if (!posts || posts.length === 0) {
//         return res.status(404).json({ message: 'No posts found for this community' });
//       }

//       // Return posts for the specified community
//       return res.status(200).json(posts);
//     }

//     // If communityId is not provided, fetch all posts
//     const allPosts = await Post.find();

//     if (!allPosts || allPosts.length === 0) {
//       return res.status(404).json({ message: 'No posts found' });
//     }

//     // Return all posts
//     return res.status(200).json(allPosts);
    
//   } catch (error) {
//     return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
//   }
// };


// export const getPostsByCommunityId = async (req: Request, res: Response) => {
//   try {
//     const { communityId } = req.params;
//     const { cursor, limit = 50 } = req.query;

//     let query = {};
//     if (cursor) {
//       query = { ...query, _id: { $gt: cursor } };
//     }
    
//     // Define the query based on the presence of communityId
//     if (communityId) {
//       query = { ...query, communityId };
//     }

//     // Fetch posts using the cursor-based pagination query
//     const posts = await Post.find(query).limit(Number(limit));

//     if (!posts || posts.length === 0) {
//       return res.status(404).json({
//         message: communityId ? 'No posts found for this community' : 'No posts found',
//       });
//     }

//     // Get the next cursor (last post's _id in the current result)
//     const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

//     // Return the paginated data
//     return res.status(200).json({
//       status: 200,
//       nextCursor,
//       totalResults: posts.length,
//       posts,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
//   }
// };



// improved code for get api 



export const getPostsByCommunityId = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const { cursor, limit } = req.query;

    // Define the query object
    let query: {
      _id?: { $gt: string };
      communityId?: string | null | { $exists: boolean };
    } = {};

    // Apply cursor-based pagination if cursor is provided
    if (cursor && typeof cursor === "string") {
      query._id = { $gt: cursor }; // Cursor-based pagination
    }

    // If communityId is present in the request parameters, filter by that ID
    if (communityId) {
      query.communityId = communityId; // Retrieve records with the specific communityId
    } else {
      // If communityId is not present, fetch records with communityId that is either null or does not exist
      query.communityId = { $exists: false }; // To fetch records without communityId
      // Alternatively, if you want records with communityId explicitly set to null, use:
      // query.communityId = null;
      query.communityId = communityId; // Retrieve records with the specific communityId
    } else {
      // If communityId is not present, fetch records with communityId that is either null or does not exist
      query.communityId = { $exists: false }; // To fetch records without communityId
      // Alternatively, if you want records with communityId explicitly set to null, use:
      // query.communityId = null;
    }

    // Set limit, default to 50 if not provided
    const limitNumber = limit ? Number(limit) : 50;

    // Fetch posts based on the constructed query
    // const posts = (await Post.find(query).limit(limitNumber)) || [];
    const posts = await Post.find(query)
      .populate("userId", "firstName lastName") // Specify fields to populate
      .limit(limitNumber)
      .exec();

    // If no posts are found, return a 404 response
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: communityId
          ? "No posts found for this community"
          : "No posts found",
      });
    }

    // Get the next cursor (last post's _id in the current result)
    const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

    // Return the paginated data
    return res.status(200).json({
      status: 200,
      nextCursor,
      totalResults: posts.length,
      posts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: (error as Error).message });
  }
};
