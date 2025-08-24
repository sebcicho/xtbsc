import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockMetadata } from '../interfaces/stock-metadata';

interface MetadataState {
  stockMetadata: StockMetadata[];
  currencyMetadata: string[];
}

const initialState: MetadataState = {
  stockMetadata: [],
  currencyMetadata: [],
};

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setStockMetadata: (state, action: PayloadAction<StockMetadata[]>) => {
      state.stockMetadata = action.payload;
    },
    setCurrencyMetadata: (state, action: PayloadAction<string[]>) => {
      state.currencyMetadata = action.payload;
    },
  },
});

export const { setStockMetadata, setCurrencyMetadata } = metadataSlice.actions;
export default metadataSlice.reducer;