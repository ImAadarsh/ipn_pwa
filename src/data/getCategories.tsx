import {URLS} from '../config';

export async function getCategories() {
  const response = await fetch(URLS.GET_CATEGORIES);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json.categories;
}
