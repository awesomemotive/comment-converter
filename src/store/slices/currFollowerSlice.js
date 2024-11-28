import { createSlice } from '@reduxjs/toolkit';

export const currFollowerSlice = createSlice({
	name: 'currFollower',
	initialState: {
		id: null,
	},
	reducers: {
		setFollowerId: (state, action) => {
			state.id = action.payload;
		},
	},
});

export const { setFollowerId } = currFollowerSlice.actions;

export default currFollowerSlice;
