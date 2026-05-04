import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from 'moment-timezone';
import { response } from "express";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error in getting current user" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    const userId = req.userId;
    const user = await User.findByIdAndUpdate(
      userId,
      { assistantName, assistantImage },
      { returnDocument: "after" },
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in updateAssistant controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error in updating assistant" });
  }
};

export const getAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save();
    const assistantName = user.assistantName;
    const userName = user.name;
    const geminiResult = await geminiResponse(
      command,
      assistantName,
      userName
    );
      if(!geminiResult) {
        return res.status(500).json({ response: "sorry, I didn't understand that." });
      }
    const jsonMatch = geminiResult.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res
        .status(500)
        .json({ response: "sorry, I didn't understand that." });
    }
    const jsonResponse = JSON.parse(jsonMatch[0]);
    const type = jsonResponse.type;

    switch (type) {
      case "general":
         return res.json({
          type,
          userinput: jsonResponse.userinput,
          response: jsonResponse.response,
        });
      case "get_time":
        return res.json({
          type,
          userinput: jsonResponse.userinput,
          response: `current time is ${moment().tz('Asia/Kolkata').format("h:mm A")}`,
        });
      case "get_date":
        return res.json({
          type,
          userinput: jsonResponse.userinput,
          response: `today's date is ${moment().tz('Asia/Kolkata').format("MMMM Do YYYY")}`,
        });
      case "get_day":
        return res.json({
          type,
          userinput: jsonResponse.userinput,
          response: `today is ${moment().tz('Asia/Kolkata').format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userinput: jsonResponse.userinput,
          response: `current month is ${moment().tz('Asia/Kolkata').format("MMMM")}`,
        });

      case "get_weather":
      case "google_search":
      case "google_open":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "twitter_open":
      case "linkedin_open":
      case "github_open":
      case "youtube_open":
        return res.json({
          type,
          userinput: jsonResponse.userinput,
          response: jsonResponse.response,
        })
        default:
        return res.json({type,
          userinput: jsonResponse.userinput,
           response: `sorry, I have no Access of ${jsonResponse.response}` 
          });
    }
  } catch (error) {
    console.error("Error in getAssistant controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error in getting assistant response" });
  }
};
