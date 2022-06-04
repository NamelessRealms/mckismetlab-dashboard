import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";
import ILauncherAssets, { ILauncherAssetServer } from "../../interfaces/ILauncherAssets";

interface ILauncherAssetsState extends ILauncherAssets {

}

const initialState: ILauncherAssetsState = {
  version: "",
  updated: 0,
  servers: []
}

export const launcherAssets = createSlice({
  name: "launcherAssets",
  initialState,
  reducers: {
    setLauncherAssets: (state, action: PayloadAction<ILauncherAssets>) => {
      state.version = action.payload.version;
      state.updated = action.payload.updated;
      state.servers = action.payload.servers;
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    setUpdated: (state, action: PayloadAction<number>) => {
      state.updated = action.payload;
    },
    setServers: (state, action: PayloadAction<Array<ILauncherAssetServer>>) => {
      state.servers = action.payload;
    },
    setServer: (state, action: PayloadAction<{ id: string, data: ILauncherAssetServer }>) => {
      const newServerState = current(state).servers.map((server) => {
        if (server.id === action.payload.id) server = action.payload.data;
        return server;
      });
      state.servers = newServerState;
    }
  }
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       version: action.payload.launcherAssets.version,
  //       servers: action.payload.launcherAssets.servers,
  //       updated: action.payload.launcherAssets.updated
  //     };
  //   }
  // }
});

export const { setLauncherAssets, setVersion, setUpdated, setServers, setServer } = launcherAssets.actions;
export default launcherAssets.reducer;