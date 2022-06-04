import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
// import { createWrapper } from "next-redux-wrapper";
import launcherAssets from "./slices/launcherAssetsSlice";

export const store = configureStore({
  reducer: {
    launcherAssets
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
   ReturnType,
   RootState,
   unknown,
   Action<string>
 >;

// const makeStore = () => configureStore({
//   reducer: {
//     launcherAssets
//   },
// });

// export type AppStore = ReturnType<typeof makeStore>;
// export type AppState = ReturnType<AppStore["getState"]>;
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

// export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });