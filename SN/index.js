const express = require('express');
const app = express();


const userRoutes = require('./routes/User')
const profileRoutes = require('./routes/Profiles')
const courseRoutes = require('./routes/Courses')

const cloudniaryConnect = require('./config/cloudinary')
const dbConnect = require('./config/database')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config();

const PORT = 4000;
app.use(express.json());
app.use(cookieParser())

app.use(
	cors()
	//cors({
		//origin:"Here you must have to define frontend url for connecting with backend... http://localhost:5718",
		//credentials:true,
	//})
)

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp",
	})
)


// connect with db
dbConnect();

// connect with cloudinary
cloudniaryConnect();


// Routes 
app.use('/api/v1/auth', userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use('/api/v1/course', courseRoutes);




//def route
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

// listen server
app.listen(PORT, () => {
    console.log("Server Connected.")
})