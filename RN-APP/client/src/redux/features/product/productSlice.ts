import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'allProducts',
  initialState: [],
  reducers: {
    setProducts: (state, action) => {
      return action.payload;
    },
  },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;