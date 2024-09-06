import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/ingredientsSlice';
import {
  getOrderByNumber,
  orderModalSelector,
  orderSelector,
  ordersSelector
} from '../../services/ordersSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const param = useParams();
  const info = useSelector(ordersSelector);

  useEffect(() => {
    if (Number(param.number)) {
      const order: TOrder | undefined = info.find(
        (item) => item.number === Number(param.number)
      );
      if (order) {
        setOrderData(order);
      } else {
        dispatch(getOrderByNumber(Number(param.number)));
      }
    }
  }, [dispatch, Number(param.number)]);

  const modalData = useSelector(orderModalSelector);
  const [orderData, setOrderData] = useState<TOrder | null>();

  useEffect(() => {
    if (modalData && modalData.number === Number(param.number)) {
      setOrderData(modalData);
    }
  }, [modalData, param.number]);

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
