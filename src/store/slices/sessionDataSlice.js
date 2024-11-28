import { createSlice } from '@reduxjs/toolkit';

export const sessionDataSlice = createSlice({
	name: 'sessionData',
	initialState: {
		dismissedWelcomeBack: false,
	},
	reducers: {
		dismissWelcomeBack: (state) => {
			state.dismissedWelcomeBack = true;
		},
	},
});

export const { dismissWelcomeBack } = sessionDataSlice.actions;

export default sessionDataSlice;
