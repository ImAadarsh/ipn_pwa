import {URLS} from '../config';

export async function getCoupons(userId?: number) {
  const url = userId ? `${URLS.GET_COUPONS}?user_id=${userId}` : URLS.GET_COUPONS;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const json = await response.json();
  return json.success ? json.coupons : [];
}
