export type Destination = {
  id: number;
  name: string;
  location: string;
  image: string;
};

export const popularDestinations: Destination[] = [
  {
    id: 1,
    name: "Setti Fatma Waterfalls",
    location: "Upper Ourika Valley, Morocco",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Berber Village Hike",
    location: "Oukaimeden Road, Morocco",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Bio-Aromatique Gardens",
    location: "Ourika Road, Marrakech",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Traditional Cooking Class",
    location: "Tnine Ourika, Morocco",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Zipline Adventure Park",
    location: "Terres d'Amanar, Morocco",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200&auto=format&fit=crop",
  },
];
