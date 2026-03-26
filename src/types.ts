export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  painPoints?: { title: string; description: string }[];
  analysisPoints?: string[];
  price?: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}
