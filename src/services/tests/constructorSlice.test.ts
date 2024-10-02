import { constructorSlice, IConstructorState } from '../constructorSlice';
import { RequestStatus, TConstructorIngredient } from '../../utils/types';

describe('constructorSlice', () => {
  let initialState: IConstructorState;

  const sauce: TConstructorIngredient = {
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
    image_mobile: 'url',
    id: '1'
  };

  const bun: TConstructorIngredient = {
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
    image_mobile: 'url',
    id: '2'
  };

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: [],
      requestStatus: RequestStatus.Idle
    };
  });

  test('Тест для добавления ингредиента', () => {
    const action = {
      type: constructorSlice.actions.addIngredient.type,
      payload: sauce
    };
    const newState = constructorSlice.reducer(initialState, action);
    expect(newState.bun).toBe(null);
    expect(newState.ingredients).toContain(sauce);
  });

  test('Тест для удаления ингредиента', () => {
    const constructorIngredients = {
      ...sauce,
      id: '1'
    };
    initialState.ingredients.push(constructorIngredients);
    const action = {
      type: constructorSlice.actions.removeIngredient.type,
      payload: sauce._id
    };
    const newState = constructorSlice.reducer(initialState, action);
    expect(newState.bun).toBe(null);
    expect(newState.ingredients).not.toContain(sauce);
  });
  test('Тест для перемещения ингредиента вверх', () => {
    // Добавляем ингредиенты в состояние
    const constructorIngredients = {
      ...sauce,
      id: '1'
    };
    const constructorIngredientsBun = {
      ...bun,
      id: '2'
    };
    initialState.ingredients.push(
      constructorIngredients,
      constructorIngredientsBun
    );

    const action = {
      type: constructorSlice.actions.moveIngredientUp.type,
      payload: 1 // Индекс второго ингредиента (булка)
    };

    const newState = constructorSlice.reducer(initialState, action);

    expect(newState.ingredients[0]).toEqual(bun); // Булка должна быть на первом месте
    expect(newState.ingredients[1]).toEqual(sauce); // Соус должен быть на втором месте
  });

  test('Тест для перемещения ингредиента вниз', () => {
    const constructorIngredients = {
      ...sauce,
      id: '1'
    };
    const constructorIngredientsBun = {
      ...bun,
      id: '2'
    };
    initialState.ingredients.push(
      constructorIngredients,
      constructorIngredientsBun
    );

    const action = {
      type: constructorSlice.actions.moveIngredientDown.type,
      payload: 0 // Индекс первого ингредиента (соус)
    };

    const newState = constructorSlice.reducer(initialState, action);

    expect(newState.ingredients[0]).toEqual(bun); // Булка должна быть на первом месте
    expect(newState.ingredients[1]).toEqual(sauce); // Соус должен быть на втором месте
  });

  test('moveIngredientUp: не перемещает первый ингредиент', () => {
    const constructorIngredients = {
      ...sauce,
      id: '1'
    };
    initialState.ingredients.push(constructorIngredients);

    const action = {
      type: constructorSlice.actions.moveIngredientUp.type,
      payload: 0 // Индекс первого ингредиента
    };

    const newState = constructorSlice.reducer(initialState, action);

    expect(newState.ingredients).toEqual(initialState.ingredients); // Состояние не должно измениться
  });

  test('moveIngredientDown: не перемещает последний ингредиент', () => {
    const constructorIngredientsBun = {
      ...bun,
      id: '2'
    };
    initialState.ingredients.push(constructorIngredientsBun); // Добавляем только соус

    const action = {
      type: constructorSlice.actions.moveIngredientDown.type,
      payload: 0 // Индекс единственного ингредиента
    };

    const newState = constructorSlice.reducer(initialState, action);

    expect(newState.ingredients).toEqual(initialState.ingredients); // Состояние не должно измениться
  });
});
