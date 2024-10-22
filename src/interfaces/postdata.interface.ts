
export interface PostData {
    userId: string; 
    content: string;
    mediaUrl?: string; // Optional mediaUrl

}

export interface CustomRequest extends Request {
    user?: {
        _id: string; 
    };
}
