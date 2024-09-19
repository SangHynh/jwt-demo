const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Định nghĩa schema cho người dùng
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hàm middleware để mã hóa mật khẩu trước khi lưu người dùng
UserSchema.pre("save", async function (next) {
  try {
    // Tạo salt với độ dài 10 vòng lặp
    const salt = await bcrypt.genSalt(10);
    // Mã hóa mật khẩu bằng salt đã tạo
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Gán mật khẩu đã mã hóa vào thuộc tính password
    this.password = hashedPassword;
    // Tiếp tục với middleware tiếp theo
    next();
  } catch (error) {
    next(error);
  }
});

// Phương thức kiểm tra mật khẩu hợp lệ
UserSchema.methods.isValidPassword = async function (password) {
  try {
    // So sánh mật khẩu được cung cấp với mật khẩu đã mã hóa
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error; 
  }
}
const User = mongoose.model("User", UserSchema);

module.exports = User;
