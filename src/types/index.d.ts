export interface Coupon {
  id: number;
  coupon_code: string;
  discount_percentage: number;
  discount_amount: number;
  max_discount?: number;
  workshop_id?: number;
  workshop_name?: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
} 