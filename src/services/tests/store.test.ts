import { expect, test, describe } from '@jest/globals';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../ingredientsSlice';
import { ordersSlice } from '../ordersSlice';
import { constructorSlice } from '../constructorSlice';
import { authSlice } from '../authSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  ordersSlice,
  authSlice
);

describe('Тесты для rootReducer', () => {
  test('Проверка правильной инициализации', () => {
    const store = configureStore({
      reducer: rootReducer,
      devTools: false
    });
    expect(store.getState()).toEqual({
      [ingredientsSlice.name]: ingredientsSlice.reducer(undefined, {
        type: '@@INIT'
      }),
      [ordersSlice.name]: ordersSlice.reducer(undefined, {
        type: '@@INIT'
      }),
      [authSlice.name]: authSlice.reducer(undefined, {
        type: '@@INIT'
      })
    });
  });
});
