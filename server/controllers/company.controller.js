// import { Company } from "../models/company.model.js";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";

// export const registerCompany = async (req, res) => {
//   try {
//     const { companyName } = req.body;
//     if (!companyName) {
//       return res.status(400).json({
//         message: "Company name is required.",
//         success: false,
//       });
//     }
//     let company = await Company.findOne({ name: companyName });
//     if (company) {
//       return res.status(400).json({
//         message: "You can't register same company.",
//         success: false,
//       });
//     }
//     company = await Company.create({
//       name: companyName,
//       userId: req.id,
//     });

//     return res.status(201).json({
//       message: "Company registered successfully.",
//       company,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const getCompany = async (req, res) => {
//   try {
//     const userId = req.id; 
//     const companies = await Company.find({ userId });
//     if (!companies) {
//       return res.status(404).json({
//         message: "Companies not found.",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       companies,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// // get company by id
// export const getCompanyById = async (req, res) => {
//   try {
//     const companyId = req.params.id;
//     const company = await Company.findById(companyId);
//     if (!company) {
//       return res.status(404).json({
//         message: "Company not found.",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       company,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const updateCompany = async (req, res) => {
//   try {
//     const { name, description, website, location } = req.body;

//     //with or without logo
//     let logo;
//     if (req.file) {
//       const fileUri = getDataUri(req.file);
//       const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//       logo = cloudResponse.secure_url;
//     }

//     const updateData = { name, description, website, location };
//     if (logo) updateData.logo = logo;

//     const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//     });

//     if (!company) {
//       return res.status(404).json({
//         message: "Company not found.",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       message: "Company information updated.",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register new company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    const existing = await Company.findOne({ name: companyName });
    if (existing) {
      return res.status(400).json({
        message: "You can't register the same company twice.",
        success: false,
      });
    }

    const company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Register company error:", error);
    return res.status(500).json({
      message: "Something went wrong while registering company.",
      success: false,
      error: error.message,
    });
  }
};

// Get all companies for current user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error("Get company error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching companies.",
      success: false,
      error: error.message,
    });
  }
};

// Get single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Get company by ID error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching company.",
      success: false,
      error: error.message,
    });
  }
};

// Update company info and optionally logo
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (location) updateData.location = location;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloudResponse.secure_url;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Update company error:", error);
    return res.status(500).json({
      message: "Something went wrong while updating company.",
      success: false,
      error: error.message,
    });
  }
};

