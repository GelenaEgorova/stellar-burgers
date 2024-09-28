import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, RequestStatus} from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

export interface IConstructorState {
  bun: null | TConstructorIngredient;
  ingredients: TConstructorIngredient[];
  requestStatus: RequestStatus;
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
  requestStatus: RequestStatus.Idle
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TConstructorIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },

    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    stateSelector: (state) => state,
    ingredientsSelector: (state) => state.ingredients
  }
});

export const { stateSelector, ingredientsSelector } =
  constructorSlice.selectors;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;
