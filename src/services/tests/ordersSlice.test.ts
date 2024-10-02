import { RequestStatus, TOrder, TOrdersData } from '../../utils/types';
import {
  ordersSlice,
  initialState,
  getOrders,
  getFeeds,
  getOrderByNumber,
  resetOrder,
  postOrderBurger
} from '../ordersSlice';
import store from '../store';

describe('Тест для ordersSlice', () => {
  beforeEach(() => {
    store.dispatch(resetOrder());
  });

  test('Тест для статуса ожидания (getOrders)', () => {
    const state = ordersSlice.reducer(initialState, getOrders.pending(''));
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('Тест для ошибки (getOrders)', () => {
    const action = {
      type: getOrders.rejected.type,
      error: { message: 'Error' }
    };
    const state = ordersSlice.reducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
  });

  test('Тест для успешной обработки (getOrders.fulfilled)', () => {
    const ordersPayload = {
      orders: [
        {
          ingredients: [],
          _id: 'id1',
          status: 'done',
          name: 'Краторный spicy био-марсианский бургер',
          createdAt: '',
          updatedAt: '',
          number: 1
        },
        {
          ingredients: [],
          _id: 'id2',
          status: 'done',
          name: 'Краторный spicy био-марсианский бургер',
          createdAt: '',
          updatedAt: '',
          number: 2
        }
      ]
    };

    const state = ordersSlice.reducer(initialState, {
      type: getOrders.fulfilled.type,
      payload: ordersPayload
    });

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      personOrders: { orders: ordersPayload.orders },
      status: RequestStatus.Success,
      error: null
    });
  });

  test('Тест для статуса ожидания (getFeeds)', () => {
    const state = ordersSlice.reducer(initialState, getFeeds.pending(''));
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('Тест для ошибки (getFeeds)', () => {
    const action = {
      type: getFeeds.rejected.type,
      error: { message: 'Error' }
    };
    const state = ordersSlice.reducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
  });

  test('Тест для успешной обработки (getFeeds)', () => {
    const OrderState: TOrdersData = {
      orders: [
        {
          ingredients: [],
          _id: 'id',
          status: 'done',
          name: 'Краторный spicy био-марсианский бургер',
          createdAt: '',
          updatedAt: '',
          number: 1
        }
      ],
      total: 3000,
      totalToday: 3028
    };
    const state = ordersSlice.reducer(initialState, {
      type: getFeeds.fulfilled.type,
      payload: OrderState
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      orders: OrderState.orders,
      total: OrderState.total,
      totalToday: OrderState.totalToday,
      status: RequestStatus.Success
    });
  });

  test('Тест для статуса ожидания (postOrderBurger)', () => {
    const state = ordersSlice.reducer(initialState, {
      type: postOrderBurger.pending.type
    });
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('Тест для ошибки (postOrderBurger)', () => {
    const action = {
      type: postOrderBurger.rejected.type,
      error: { message: 'Error' }
    };
    const state = ordersSlice.reducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
  });

  test('Тест для успешной обработки (postOrderBurger)', () => {
    const orderPayload = {
      order: {
        _id: 'order_id',
        ingredients: [],
        status: 'pending',
        name: 'Новый бургер',
        createdAt: '',
        updatedAt: '',
        number: 2
      },
      name: 'Новый бургер'
    };
    const state = ordersSlice.reducer(initialState, {
      type: postOrderBurger.fulfilled.type,
      payload: orderPayload
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      order: orderPayload.order,
      name: orderPayload.name,
      status: RequestStatus.Success
    });
  });

  test('Тест для статуса ожидания (getOrderByNumber)', () => {
    const state = ordersSlice.reducer(initialState, {
      type: getOrderByNumber.pending.type
    });
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('Тест для ошибки (getOrderByNumber)', () => {
    const action = {
      type: getOrderByNumber.rejected.type,
      error: { message: 'Error' }
    };
    const state = ordersSlice.reducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
  });

  test('Тест для успешной обработки (getOrderByNumber)', () => {
    const orderModalPayload = {
      orders: [
        {
          ingredients: [],
          _id: 'order_id',
          status: 'done',
          name: 'Краторный spicy био-марсианский бургер',
          createdAt: '',
          updatedAt: '',
          number: 1
        }
      ]
    };
    const state = ordersSlice.reducer(initialState, {
      type: getOrderByNumber.fulfilled.type,
      payload: orderModalPayload
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      orderModal: orderModalPayload.orders,
      status: RequestStatus.Success
    });
  });

  test('Тест для сброса состояния (resetOrder)', () => {
    const state = ordersSlice.reducer(initialState, resetOrder());
    expect(state).toEqual({
      ...initialState,
      order: null,
      name: null
    });
  });
});
