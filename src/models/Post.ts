import { Schema, Types, model } from 'mongoose';

interface IPost {
	title: string;
	description: string;
	author: Types.ObjectId;
	date: Schema.Types.Date;
}

const PostSchema = new Schema<IPost>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Schema.Types.Date, required: true, default: Date.now() },
});

const Post = model<IPost>('Post', PostSchema);

export { Post, IPost };
