export interface LoginResponse {
    user: User,
    token: string;
  }

  export interface User {
      firstName: string;
      lastName: string;
      email: string;
  }