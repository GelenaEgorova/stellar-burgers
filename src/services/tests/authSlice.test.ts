import { TLoginData } from '../../utils/burger-api';
import { RequestStatus } from '../../utils/types';
import {
  checkUserAuth,
  initialState,
  loginUser,
  logOutUser,
  signInUser,
  updateUser,
  authSlice,
  setUser,
  setIsAuthChecked
} from '../authSlice';

const userData = {
    user: {
        name: 'Егорова Гелена',
        email: 'gegorova@mail.ru',
        password: '123'
    },
    success: true
};

const loginUserData = {
    email: 'gegorova@mail.ru',
    password: '123'
};

const updateUserData = {
    name: 'Егорова Гелена Вадимовна',
    email: 'gegorova@mail.ru',
    password: '123'
};

describe('Тесты для authSlice', () => {
    let state: ReturnType<typeof authSlice.reducer>; 

    beforeEach(() => {
        state = { ...initialState }; 
    });

    test('Тест для начального состояния', () => {
        const newState = authSlice.reducer(state, authSlice.actions.setIsAuthChecked(true));
        expect(newState.isAuthChecked).toEqual(true);
    });

    test('Тест для userLogout', () => {
        const newState = authSlice.reducer(state, authSlice.actions.setUser(null));
        expect(newState.user).toEqual(null);
    });

    test('Тест для загрузки (signInUser.pending)', () => {
        const action = { type: signInUser.pending.type};
        const newState = authSlice.reducer(state, action);
        expect(newState.loading).toBe(true);
        expect(newState.requestStatus).toBe(RequestStatus.Loading);
    });

    test('Тест для успешной регистрации (signInUser.fulfilled)', () => {
        const action = { type: signInUser.fulfilled.type, payload: userData };
        const newState = authSlice.reducer(state, action);
        expect(newState.loading).toBe(false);
        expect(newState.user).toEqual(userData.user);
        expect(newState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Тест для ошибки при регистрации (signInUser.rejected)', () => {
        const action = { type: signInUser.rejected.type, error: { message: 'Error' } };
        const newState = authSlice.reducer(state, action);
        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Error');
        expect(newState.requestStatus).toBe(RequestStatus.Failed);
    });

    test('Тест для загрузки (loginUser.pending)', () => {
        const action = { type: loginUser.pending.type};
        const newState = authSlice.reducer(state, action);
        expect(newState.loading).toBe(true);
        expect(newState.requestStatus).toBe(RequestStatus.Loading);
    });

    test('Тест для успешного входа (loginUser.fulfilled)', () => {
        const action = { type: loginUser.fulfilled.type, payload: userData };
        const newState = authSlice.reducer(state, action);
        expect(newState.loading).toBe(false);
        expect(newState.user).toEqual(userData.user);
        expect(newState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Тест для ошибки при входе (loginUser.rejected)', () => {
        const action = { type: loginUser.rejected.type, error: { message: 'Error' } };
        const newState = authSlice.reducer(state, action);
        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Error');
        expect(newState.requestStatus).toBe(RequestStatus.Failed);
    });

    test('Тест для успешного выхода (logOutUser.fulfilled)', () => {
        state.user = userData.user; 
        const action = { type: logOutUser.fulfilled.type };
        const newState = authSlice.reducer(state, action);
        expect(newState.user).toBeNull();
        expect(newState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Тест для ошибки при выходe (logOutUser.rejected)', () => {
        state.user = userData.user; 
        const action = { type: logOutUser.rejected.type, error: { message: 'Error' }  };
        const newState = authSlice.reducer(state, action);
        expect(newState.error).toBe('Error');
        expect(newState.requestStatus).toBe(RequestStatus.Failed);
    });

    test('Тест для успешного обновления пользователя (updateUser.fulfilled)', () => {
        const action = { type: updateUser.fulfilled.type, payload: { user: updateUserData } };
        state.user = userData.user;
        const newState = authSlice.reducer(state, action);
        expect(newState.user).toEqual(updateUserData);
        expect(newState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Тест для проверки статуса авторизации (setIsAuthChecked)', () => {
        const action = setIsAuthChecked(true);
        const newState = authSlice.reducer(state, action);
        expect(newState.isAuthChecked).toBe(true);
    });

    test('Тест для установки пользователя (setUser)', () => {
        const action = setUser(userData.user);
        const newState = authSlice.reducer(state, action);
        expect(newState.user).toEqual(userData.user);
    });
});
