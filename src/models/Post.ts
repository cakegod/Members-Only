import { Schema, model } from 'mongoose';

interface IPost {
	title: string;
	text: string;
	date: Schema.Types.Date;
	password: string;
}

const PostSchema = new Schema<IPost>({
	title: { type: String, required: true },
	text: { type: String, required: true },
	date: { type: Schema.Types.Date, required: true, default: Date.now() },
	password: { type: String, required: true },
});

const Post = model<IPost>('Post', PostSchema);

export { Post, IPost };
