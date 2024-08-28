import mongoose from "mongoose";


const SettingsSchema = mongoose.Schema({
  clientEmail: {
    type: String,
    required: true,
},
privateKey: {
    type: String,
    required: true,
},
sheetId: {
    type: String,
    required: true,
},
selectedColumns: {
    type: [String],
    default: [
        'Timestamp',
        'Order Reference',
        'Customer Name',
        'Customer Phone',
        'Customer Address',
        'Product Title',
        'Product Variant',
        'Quantity',
        'Unit Price',
        'Item Total Price',
        'Order Total Price',
        'Order Status',
    ], // Default columns
},
},
{
    timestamps: true,
});


const Setting = mongoose.model('Setting', SettingsSchema);

export default Setting;


