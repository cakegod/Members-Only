import { Schema, model, InferSchemaType } from 'mongoose';

const MemberSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	membership: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

type TMember = InferSchemaType<typeof MemberSchema>;

const Member = model('Member', MemberSchema);

export { Member, TMember };
