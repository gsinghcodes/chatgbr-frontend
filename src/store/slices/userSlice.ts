import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDetails {
	id: string;
	email: string;
	github_username: string | null;
	github_installed: boolean;
	avatar_url: string | null;
}

interface UserState {
	isLoggedIn: boolean;
	details: UserDetails | null;
}

const initialState: UserState = {
	isLoggedIn: false,
	details: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,

	reducers: {
		setIsLoggedIn(
			state,
			action: PayloadAction<boolean>,
		) {
			state.isLoggedIn = action.payload;
		},

		setUserDetails(
			state,
			action: PayloadAction<UserDetails>,
		) {
			state.details = action.payload;
		},

		clearUser(state) {
			state.isLoggedIn = false;
			state.details = null;
		},
	},
});

export const {
	setIsLoggedIn,
	setUserDetails,
	clearUser,
} = userSlice.actions;

export default userSlice.reducer;