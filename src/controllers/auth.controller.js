const createError = require('http-errors');
const User = require('../models/user.model');
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../configs/jwt.config');

//ĐĂNG KÝ TÀI KHOẢN
const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Kiểm tra xem người dùng có tồn tại không
        const doesExist = await User.findOne({ email: email });
        if (doesExist) {
            throw createError.Conflict(`${email} is already registered`);
        }
        // Tạo một đối tượng người dùng mới
        const user = new User({
            email,
            password
        });
        // Lưu người dùng vào cơ sở dữ liệu
        const savedUser = await user.save();
        // Tạo tokens
        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id);
        // Trả tokens cho client và phản hồi kết quả
        res.send({accessToken, refreshToken});
    } catch (error) {
        next(error);
    }
};


//ĐĂNG NHẬP TÀI KHOẢN
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Tìm người dùng trong cơ sở dữ liệu theo email
        const user = await User.findOne({ email: email });
        if (!user) throw createError.NotFound('User not registered');
        // Kiểm tra xem mật khẩu có hợp lệ không
        const isMatch = await user.isValidPassword(password);  
        // Mật khẩu không hợp lệ
        if (!isMatch) throw createError.Unauthorized('Invalid username or password');
        // Tạo tokens cho người dùng
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        // Trả về các tokens cho client
        res.send({ accessToken, refreshToken });
    } catch (error) {
        // Chuyển lỗi tới middleware xử lý lỗi
        next(error); 
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;
        if (!refreshToken) throw createError.BadRequest();
        const userId  = await verifyRefreshToken(refreshToken);

        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);
        res.send({accessToken: accessToken, refreshToken: refToken});
        console.log({accessToken: accessToken, refreshToken: refToken});
        // Lưu refreshToken vào database hoặc redis
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    res.send('logout route');
};

module.exports = {
    register,
    login,
    refreshToken,
    logout
};
