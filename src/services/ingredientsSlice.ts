import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TIngredient } from '../utils/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from './../utils/burger-api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

export interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined | null;
  status: RequestStatus;
}

export const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
  status: RequestStatus.Idle
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    isLoadingSelector: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.status = RequestStatus.Loading;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.status = RequestStatus.Success;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.status = RequestStatus.Failed;
      });
  }
});

export const { ingredientsSelector, isLoadingSelector } =
  ingredientsSlice.selectors;
