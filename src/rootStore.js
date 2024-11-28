import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { localApi } from './store/localApi';
import { marketingApi } from './store/marketingApi';
import currFollowerSlice from './store/slices/currFollowerSlice';
import sessionDataSlice from './store/slices/sessionDataSlice';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
	key: 'ccvtrState',
	version: 1,
	storage: storageSession,
	whitelist: [sessionDataSlice.name],
};

const rootReducer = combineReducers({
	// Add your slices here
	[currFollowerSlice.name]: currFollowerSlice.reducer,
	[sessionDataSlice.name]: sessionDataSlice.reducer,
	[localApi.reducerPath]: localApi.reducer,
	[marketingApi.reducerPath]: marketingApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,

	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(localApi.middleware, marketingApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export const persistor = persistStore(store);
