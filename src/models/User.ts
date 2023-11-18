import { InferSchemaType, model, Schema } from 'mongoose';

// interface IUser {
// 	username: string;
// 	password: string;
// 	membership: 'newbie' | 'member' | 'admin';
// }

const UserSchema = new Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		membership: { type: String, required: true, default: 'newbie' },
	},
	{
		virtuals: {
			isAdmin: {
				get() {
					return this.membership === 'admin';
				},
			},
		},
		methods: {
			is(user) {
				return this.id === user.id;
			},
		},
	},
);
type IUser = InferSchemaType<typeof UserSchema>;

const User = model('User', UserSchema);

export { User, IUser };
