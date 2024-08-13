import dotenv from 'dotenv';
dotenv.config();
import Admin from "../models/admin.model.js";
import bcryptjs from "bcryptjs"; 
import jwt from "jsonwebtoken";

export const signin = async (request, response, next) => {
  const { email, password } = request.body;
  try{
    const user = await Admin.findOne({ email });
    
    if (!user) {
      return response.status(401).json({ message: "Incorrect credentials" });
    }
    
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return response.status(401).json({ message: "Incorrect credentials" });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    response.status(200).json({ message: "admin is logged in", user,token });
  } catch (error) {
      console.error("Error:", error.message);
      return response.status(500).json({ message: "Internal server error" });
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Internal server error" });
  }   
}; 

export const updateAdmin = async (req, res, next) => {
  const {
       firstName,
       lastName,
       email,
       currentPassword,
       newPassword
     } = req.body; 
  try {
    const updatedAdmin = await Admin.findById(req.userId);
    if (!updatedAdmin) {
      return res.status(404).json({ message: "admin not found." });
    }

    

    if(firstName !== ""){
      updatedAdmin.firstName = firstName ;
      updatedAdmin.fullName = firstName + " " +  updatedAdmin.lastName;
    }
    if(lastName !== ""){
      updatedAdmin.lastName = lastName;
      updatedAdmin.fullName = updatedAdmin.firstName + " " +  lastName;
    }
    if(email !== ""){
      updatedAdmin.email = email;
    }
    
    const isPasswordCorrect = await bcryptjs.compare(currentPassword, updatedAdmin.password);
    if (isPasswordCorrect){
      const hashedPassword = bcryptjs.hashSync(newPassword, 10);
      updatedAdmin.password = hashedPassword;
    }
    
    await updatedAdmin.save();
    res.status(200).json({ message: 'admin data updated successfulyy' });
  } catch (error) {
      console.error('Error updating admin data', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}; 
