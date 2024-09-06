import { FC, useEffect } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  ordersSelector,
  totalSelector,
  totalTodaySelector
} from '../../services/ordersSlice';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(ordersSelector);
  const feed = {
    total: useSelector(totalSelector),
    totalToday: useSelector(totalTodaySelector)
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  console.log('Заказы в работе (pending):', pendingOrders);

  useEffect(() => {
    console.log('Полученные заказы:', orders);
  }, [orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
