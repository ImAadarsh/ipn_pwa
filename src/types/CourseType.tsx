export interface CourseType {
  id: number;
  name: string;
  image: string;
  preview_90x90?: string;
  start_date: string;
  duration: string;
  price: number;
  price_2: number;
  cut_price: number | null;
  description: string;
  trainer: {
    name: string;
    designation: string;
    image: string;
    description: string;
  };
  rating?: number;
  images?: string[];
  sizes?: string[];
  size?: string;
}
