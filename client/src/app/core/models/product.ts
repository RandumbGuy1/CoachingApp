interface Product {
  id: string;
  name: string;
  price: number;
  frequency?: string;
  badge?: string;
  description?: string;
  includes?: string[];
  guide?: string;
  system?: string;
  comingSoon?: boolean;
}

//TODO: Replace this with a stripe checkout model in the future