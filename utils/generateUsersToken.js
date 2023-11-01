
import jwt from 'jsonwebtoken';


export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw error;
  }
};

export const generateUsersToken = (userData) => {
    const accessToken = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    return accessToken;
  };
  
  export const generateRefreshToken = (userData) => {
    const refreshToken = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    return refreshToken;
  };
