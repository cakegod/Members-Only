import { InferSchemaType, model, Schema } from 'mongoose';

const PostSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		date: {
			type: Schema.Types.Date,
			default: Date.now,
		},
	},
	{
		virtuals: {
			formattedDate: {
				get() {
					const date = new Date(this.date);
					return `${date.toDateString()}, ${date.getHours()}h`;
				},
			},
		},
	},
);

type IPost = InferSchemaType<typeof PostSchema>;

const Post = model('Post', PostSchema);

export { Post, IPost };
