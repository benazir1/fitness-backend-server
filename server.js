const  express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors =require('cors');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const exercisesRoutes = require('./routes/exercise');
const warmupRoutes = require('./routes/warmup');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/exercise', exercisesRoutes);
app.use('/api/warmup',warmupRoutes);

const params ={
    useNewUrlParser:true,
    useUnifiedTopology:true
}
mongoose.connect(process.env.DB_URL,params)
.then(()=>{
    console.log("connect to MONGODB");
}).catch((err)=>{
    console.log("could not connect to DB",err)
});



app.listen(PORT,()=>{
    console.log("server is running in PORT:",PORT)
})