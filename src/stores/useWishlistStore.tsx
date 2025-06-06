import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type {CourseType} from '../types';

type WishlistStateType = {
  list: CourseType[];
  addToWishlist: (course: CourseType) => void;
  removeFromWishlist: (course: CourseType) => void;
};

const initialState: Omit<
  WishlistStateType,
  'addToWishlist' | 'removeFromWishlist'
> = {
  list: [],
};

export const useWishlistStore = create<WishlistStateType>()(
  persist(
    (set) => ({
      ...initialState,
      addToWishlist: (course) => {
        set((state) => {
          const inWishlist = state.list.find((item) => item?.id === course.id);

          if (!inWishlist) {
            return {
              ...state,
              list: [...state.list, course],
            };
          }

          return state;
        });
      },
      removeFromWishlist: (course) => {
        set((state) => ({
          ...state,
          list: state.list.filter((item) => item?.id !== course.id),
        }));
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
