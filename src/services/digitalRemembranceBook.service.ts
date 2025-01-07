import DigitalRemembranceBook from '../models/digitalRemembranceBook.model';

export const createRemembranceBook = async (userId: string, stepRecordId: string, imagesData: any) => {
  // Collect image URLs from Cloudinary
  const images = imagesData.map((image: any) => ({
    imageUrl: image.url, // Image URL from Cloudinary
    description: image.description, // Description from the frontend
    date: image.date // Date from the frontend
  }));

  const newBook = new DigitalRemembranceBook({
    userId,
    stepRecordId,
    images
  });

  return await newBook.save();
};
