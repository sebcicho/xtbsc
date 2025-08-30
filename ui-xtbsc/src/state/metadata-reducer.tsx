import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockMetadata } from '../interfaces/stock-metadata';
import { store } from './redux-configurator';
import { useDispatch } from 'react-redux';

interface MetadataState {
  stockMetadata: StockMetadata[];
  currencyMetadata: string[];
  loaded: boolean;
}

const initialState: MetadataState = {
  stockMetadata: [],
  currencyMetadata: [],
  loaded: false,
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const fetchMetadata = createAsyncThunk
  < 
    void,
    void,
  { state: RootState }>(
  'metadata/fetchMetadata',
  async (_, { dispatch }) => {
    const [stockRes, currencyRes] = await Promise.all([
      fetch('http://localhost:8080/stock/metadata').then(res => res.json()),
      fetch('http://localhost:8080/currency/metadata').then(res => res.json()),
    ]);

    dispatch(setStockMetadata(stockRes));
    dispatch(setCurrencyMetadata(currencyRes));
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      if (state.metadata.loaded) {
        return false;
      }
    },
  }
);

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setStockMetadata: (state, action: PayloadAction<StockMetadata[]>) => {
        const merged = [...state.stockMetadata, ...action.payload];
        const unique = Array.from(
            new Map(merged.map(item => [item.symbol, item])).values()
        );
        state.stockMetadata = unique;
        state.loaded = true;
    },
    setCurrencyMetadata: (state, action: PayloadAction<string[]>) => {
      state.currencyMetadata = action.payload;
      state.loaded = true;
    },
  },
});

export const { setStockMetadata, setCurrencyMetadata } = metadataSlice.actions;
export default metadataSlice.reducer;