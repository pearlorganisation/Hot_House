// -------------------------------------------Imports------------------------------------------------------
import mongoose from "mongoose";
// ----------------------------------------------------------------------------------------------------------

const sizeCustomizationSchema = new mongoose.Schema({
 
      name: {
        type: String,
        required: [true, "Size Name is a required field"],
      },
      basePrice:{
        type:Number,
        default:0
      }
    }

);

export const 
sizeCustomizationModel = mongoose.model(
  "size_Customization",
  sizeCustomizationSchema
);





