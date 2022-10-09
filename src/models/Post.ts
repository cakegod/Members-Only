import { Schema, model, InferSchemaType } from 'mongoose';

const PostSchema = new Schema({
	title: { type: String, required: true },
	text: { type: String, required: true },
	date: { type: Schema.Types.Date, required: true, default: Date.now() },
	password: { type: String, required: true },
});

type TPost = InferSchemaType<typeof PostSchema>;

const Post = model('Post', PostSchema);

export { Post, TPost };
