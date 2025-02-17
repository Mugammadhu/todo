const mongoose=require('mongoose')

const todoSchema=new mongoose.Schema({
    todo:String
},
{collection:"items"}
)

const todoModel=mongoose.model("Todos",todoSchema)

module.exports=todoModel