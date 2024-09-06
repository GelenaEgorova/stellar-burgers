import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient, stateSelector } from '../../services/constructorSlice';
import { nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const constructorItems = useSelector(stateSelector);
    const currentBun = constructorItems.bun;
    const constructorIngredient: TConstructorIngredient = {
      ...ingredient,
      id: ingredient._id
    };

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        if (currentBun?._id === ingredient._id) {
          return;
        }
        dispatch(addIngredient(constructorIngredient));
      } else {
        dispatch(addIngredient(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
