const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "prajjwalcdn",
  api_key: "578799145475633",
  api_secret: "VeDDaRgrzqp9l1xLb4cWlfTDU4M",
});
exports.cloudinary = cloudinary;
