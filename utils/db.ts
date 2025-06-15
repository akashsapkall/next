
import mongoose from "mongoose";
const MONGODB_URI= process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please add mongodb_uri in env varibles");
}
let cached=global.mongoose;
if(!cached){
    cached=global.mongoose={ conn:null, promise:null};
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opts={
            bufferCommands:true,
            maxPoolSize:5
        }
        cached.promise=mongoose.connect(MONGODB_URI, opts)
        .then(()=> mongoose.connection)
    }
    try{
        cached.conn=await cached.promise;
        return cached.conn;
    }catch(error){
        cached.promise=null;
        throw error;
    }
}