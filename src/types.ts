export interface LoginResponse {
    user: User,
    token: string;
  }

  export interface User {
      firstName: string;
      lastName: string;
      email: string;
      isActive:Boolean;
      profilePic:string;
      gender:string;
      paymentStatus:string;
  }