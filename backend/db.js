const mongoose=require('mongoose')

const connectDatabase=async()=>{
    await mongoose.connect("mongodb+srv://mugammadhu2003:786Shifath@todo.bgp97.mongodb.net/todos?retryWrites=true&w=majority&appName=todo")
    .then(()=>{
        console.log("database connected successfully")
    })
    .catch((err)=>{
        console.log("database connection issues",err)
    })
}

module.exports=connectDatabase;


