
// import Post from '../models/post.model'; // Assuming you have the Post model

// // Updated interface to include userId and content
// interface PostData {
//   userId: string; // Include userId in the interface
//   content: string;
// }

// export const createPostService = async (postData: PostData) => {
//   // Create a new post with userId and content
//   const newPost = new Post({
//     userId: postData.userId, // Assign userId from postData
//     content: postData.content,
//   });

//   // Save the new post to the database and return it
//   return await newPost.save();
// };


// above code is without multer 











// below code have functionality of multer
import Post from '../models/post.model'; 


interface PostData {
    userId: string; 
    content: string;
    mediaUrl?: string; 

}

export const createPostService = async (postData: PostData) => {
    const newPost = new Post({
        userId: postData.userId, 
        content: postData.content,
        mediaUrl:postData.mediaUrl 

    });

    return await newPost.save();
};
