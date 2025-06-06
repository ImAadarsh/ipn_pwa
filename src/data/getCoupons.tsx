import {URLS} from '../config';

export async function getCoupons() {
  const response = await fetch(URLS.GET_COUPONS);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json.coupons;
}
