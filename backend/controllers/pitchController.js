import Pitch from "../models/Pitch.js";
import Company from "../models/Company.js";

export const createPitch = async (req, res) => {
  try {
    const { companyId } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const pitchData = req.body;
    const pitch = new Pitch({ ...pitchData, companyId });
    await pitch.save();

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { pitchId: pitch._id },
      { new: true }
    );
    if (!updatedCompany) {
      throw new Error("Failed to link pitch to company");
    }

    res.status(201).json(pitch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPitch = async (req, res) => {
  try {
    const { companyId } = req.body;
    const pitch = await Pitch.findOne({ companyId });
    if (!pitch) {
      return res.status(404).json({ message: "Pitch not found" });
    }
    res.status(200).json(pitch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
