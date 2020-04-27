const mongoose = require("mongoose");

const profilePageSchema = new mongoose.Schema({
  ownedBy: {
    type: String,
    required: true,
  },
  textPosts: {
    type: [
      {
        headline: String,
        body_text: String,
        createdAt: String,
        createdBy: String,
        uniq_id: String, //used to identify the post in the db (a part of the link)
      },
    ],
  },
  link: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
});

const ProfilePage = mongoose.model("ProfilePage", profilePageSchema);

module.exports = ProfilePage;
