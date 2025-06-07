const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL || 'https://app.ipnacademy.in';
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.ipnacademy.in/storage/app/';

export const GET_COUPONS = `${MAIN_URL}/api/coupons/applicable`;
export const GET_COURSES = `${MAIN_URL}/api/workshops/live`;
export const GET_BANNERS = `${MAIN_URL}/api/sliders/list`;
export const GET_CAROUSEL = `${MAIN_URL}/api/sliders/list`;
export const GET_CATEGORIES = `${MAIN_URL}/api/categories/list`;

export const URLS = {
  MAIN_URL,
  IMAGE_URL,
  GET_BANNERS,
  GET_COURSES,
  GET_COUPONS,
  GET_CAROUSEL,
  GET_CATEGORIES,
};
