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
