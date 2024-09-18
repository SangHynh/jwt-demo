const express = require("express"); 
const createError = require('http-errors'); 
const authRoute = require('./src/routes/auth.route'); 
const { verifyAccessToken } = require("./src/configs/jwt.config");
require('dotenv').config(); 
require('./src/configs/db.config'); 
require('./src/configs/jwt.config');
require('./src/configs/redis.config');

// Khởi tạo ứng dụng Express
const app = express();

// Middleware để xử lý dữ liệu JSON từ body của yêu cầu
app.use(express.json());

// Middleware để xử lý dữ liệu URL-encoded từ body của yêu cầu
app.use(express.urlencoded({ extended: true }));

// Middleware để xử lý các route liên quan đến xác thực
app.use('/auth', authRoute);

// Test route
app.get('/', verifyAccessToken, async (req, res, next)=>{    
    res.send('Hello kitty');
})

// Middleware xử lý các yêu cầu không khớp với bất kỳ route nào đã định nghĩa
app.use(async (req, res, next) => {
    // Tạo lỗi 404 (Not Found) và chuyển tiếp lỗi này đến middleware xử lý lỗi
    next(createError.NotFound("No route"));
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    // Thiết lập mã trạng thái lỗi và gửi phản hồi lỗi về phía client
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500, 
            message: err.message, 
        }
    });
});

// Cấu hình cổng máy chủ và bắt đầu lắng nghe các yêu cầu
const PORT = process.env.PORT || 5000; 

app.listen(PORT, "localhost", () =>
    // In thông báo khi máy chủ bắt đầu lắng nghe trên cổng chỉ định
    console.log(`Server is running at http://localhost:${PORT}`)
);
