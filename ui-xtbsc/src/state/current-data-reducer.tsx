import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataPoint } from '../interfaces/data-point';

interface CurrentDataState {
  currentData: DataPoint[];
  }

const initialState: CurrentDataState = {
  currentData: [],
};

export const currentDataSlice = createSlice({
  name: 'currentData',
  initialState,
  reducers: {
    setCurrentData: (state, action: PayloadAction<DataPoint[]>) => {
      state.currentData = action.payload;
    },
  },
});

export const { setCurrentData } = currentDataSlice.actions;
export default currentDataSlice.reducer;