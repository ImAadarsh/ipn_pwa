import {URLS} from '../config';

export async function getCourses() {
  const response = await fetch(URLS.GET_COURSES);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json.courses;
}
