import { RequestStatus, TIngredient } from '../../utils/types';
import {
  ingredientsSlice,
  initialState,
  fetchIngredients
} from '../ingredientsSlice';

describe('Тест для ingredientsSlice', () => {
  test('Тест для статуса ожидания', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.pending('')
    );
    expect(state.status).toBe(RequestStatus.Loading);
  });
  test('Тест для ошибки', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.rejected(new Error('Error'), '')
    );
    expect(state.status).toBe(RequestStatus.Failed);
  });
  test('Тест для успешной обработки', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Соус',
        type: 'main',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'url',
        image_large: 'url',
        image_mobile: 'url'
      },
      {
        _id: '2',
        name: 'Булка',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'url',
        image_large: 'url',
        image_mobile: 'url'
      }
    ];

    const state = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.fulfilled(ingredients, '')
    );
    expect(state).toEqual({
      ingredients: ingredients,
      status: RequestStatus.Success,
      error: null,
      isLoading: false
    });
  });
});
