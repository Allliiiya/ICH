export interface EventInput {
  name: string;
  description: string;
  date: string;
  location: string;
  expires_at?: string;
  link: string;
}

// If your backend also returns an `id` or `created_at`, 
// you can make a separate type for full Event records:
export interface Event extends EventInput {
  id: number;
  created_at: string;
}

// Event filter interface for the filtering functionality
export interface EventFilter {
  state?: string;
  country?: string;
  time_interval?: 'day' | 'week' | 'month' | 'year';
  name_contains?: string;
  page?: number;
  page_size?: number;
}

// Event response interface for paginated results
export interface EventResponse {
  events: Event[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}