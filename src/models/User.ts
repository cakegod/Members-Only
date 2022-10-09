import { Schema, model } from 'mongoose';

interface IUser {
	// firstName: string;
	// lastName: string;
	username: string;
	password: string;
	membership: string;
}

const UserSchema = new Schema<IUser>({
	// firstName: { type: String, required: true },
	// lastName: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	membership: { type: String, required: true, default: 'normal' },
});

const User = model<IUser>('User', UserSchema);

export { User, IUser };
