const mongoose = require('mongoose');
const Schema = mongoose.Schema;

casalSchema = new Schema( {
	name: { type: String, required: true },
	desc: { type: String, required: true },
	niverH:{ type: Date, required: true },
	niverM: { type: Date, required: true },
	image: { type: String, required: true },
	tel: { type: Number, required: true },
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
casal = mongoose.model('casal', casalSchema);

module.exports = casal;