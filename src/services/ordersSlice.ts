import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

export const getFeeds = createAsyncThunk('orders/getFeeds', async () => {
  const res = await getFeedsApi();
  return res;
});

export const getOrders = createAsyncThunk('orders/getOrders', async () => {
  const res = await getOrdersApi();
  return res;
});

export const postOrderBurger = createAsyncThunk(
  'orders/postOrderBurger',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res;
  }
);

export interface IOrderState {
  name: string | null;
  order: TOrder | null;
  orders: TOrder[];
  orderModal: TOrder[];
  personOrders: TOrder[];
  total: number | null;
  totalToday: number | null;
  isLoading: boolean;
  error: string | undefined | null;
}

export const initialState: IOrderState = {
  name: null,
  order: null,
  orders: [],
  orderModal: [],
  personOrders: [],
  total: null,
  totalToday: null,
  isLoading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.name = null;
    }
  },
  selectors: {
    orderSelector: (state) => state.order,
    isLoadingSelector: (state) => state.isLoading,
    ordersSelector: (state) => state.orders,
    orderModalSelector: (state) => state.orderModal[0],
    personOrdersSelector: (state) => state.personOrders,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
      });
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.personOrders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(postOrderBurger.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postOrderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        state.name = action.payload.name;
      })
      .addCase(postOrderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModal = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const {
  orderSelector,
  isLoadingSelector,
  ordersSelector,
  orderModalSelector,
  personOrdersSelector,
  totalSelector,
  totalTodaySelector
} = ordersSlice.selectors;

export const { resetOrder } = ordersSlice.actions;
