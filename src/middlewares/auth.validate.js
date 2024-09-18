const createError = require('http-errors');

// Middleware xác thực
const authValidate = (req, res, next) => {
    const { email, password } = req.body;

    // Kiểm tra xem email và password có được cung cấp không
    if (!email || !password) {
        return next(createError.BadRequest('Email and password are required'));
    }

    // Kiểm tra định dạng email bằng regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(createError.BadRequest('Invalid email format'));
    }

    // Kiểm tra mật khẩu có ít nhất 6 ký tự
    if (password.length < 6) {
        return next(createError.BadRequest('Password must be at least 6 characters long'));
    }

    // Nếu tất cả kiểm tra đều hợp lệ, tiếp tục với xử lý tiếp theo
    next();
};

module.exports = authValidate;
