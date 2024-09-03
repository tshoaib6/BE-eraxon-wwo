import User from '../models/user.model';

export const getUserService = async () => {
  return await User.find();
};

export const signUpService = async () =>{

}

export const verifyEmail = async () =>{ 

}

export const verifyJWT = async () => { 

  
}
