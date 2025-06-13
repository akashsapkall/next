import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document{
    email:string;
    password:string;
    createdAt?:Date;
    updatedAt?:Date;
    isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema= new Schema<IUser>(
    {
        email:{ type:String, required:true, unique:true },
        password:{ type:String, required:true}
    },
    {
        timestamps:true
    }
);

userSchema.pre<IUser>('save', async function (next){
if(this.isModified("password")){
   this.password= await bcrypt.hash(this.password,10);
}
return next();
});
userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
const User=models?.User || model<IUser>('User',userSchema);
export default User;