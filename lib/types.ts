export interface Sketch {
  id: string;
  title: string;
  description: string;
  price: number;
  image_urls: string[];   // up to 3 images
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type SketchInput = Omit<Sketch, "id" | "created_at" | "updated_at">;
