import jwt from 'jsonwebtoken'


export const generateUsersToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET);
  };