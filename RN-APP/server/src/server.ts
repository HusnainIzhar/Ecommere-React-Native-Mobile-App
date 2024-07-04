import { app } from './app';
import { connectDB } from './config/db.config';
require("dotenv").config();
import { cloudinaryConnect } from './config/cloudinary.config';

//cloudinary config
cloudinaryConnect();


//connect server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});


