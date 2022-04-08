var mongoose = require('mongoose');
var Schema = mongoose.Schema;

casalSchema = new Schema( {
	name: String,
	desc: String,
	cargo: Number,
	image: String,
	tel: Number,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
casal = mongoose.model('casal', casalSchema);

module.exports = casal;