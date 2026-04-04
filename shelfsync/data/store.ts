export interface Product {
  id: string;
  name: string;
  aisle: string;
  shelf: string;
  section: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  products: Product[];
}

export const demoStore: Store = {
  id: 'target-wl-001',
  name: 'Target',
  location: 'West Lafayette',
  products: [
    {
      id: 'p001',
      name: 'Milk - Whole Gallon',
      aisle: 'A3',
      shelf: 'Middle',
      section: 'Dairy',
    },
    {
      id: 'p002',
      name: 'Bread - Wheat Loaf',
      aisle: 'B7',
      shelf: 'Top',
      section: 'Bakery',
    },
    {
      id: 'p003',
      name: 'Bananas',
      aisle: 'C1',
      shelf: 'Bottom',
      section: 'Produce',
    },
    {
      id: 'p004',
      name: 'Chicken Breast',
      aisle: 'A5',
      shelf: 'Middle',
      section: 'Meat',
    },
    {
      id: 'p005',
      name: 'Cereal - Cheerios',
      aisle: 'D4',
      shelf: 'Top',
      section: 'Breakfast',
    },
    {
      id: 'p006',
      name: 'Orange Juice',
      aisle: 'A3',
      shelf: 'Bottom',
      section: 'Beverages',
    },
    {
      id: 'p007',
      name: 'Pasta - Spaghetti',
      aisle: 'E2',
      shelf: 'Middle',
      section: 'Dry Goods',
    },
    {
      id: 'p008',
      name: 'Tomato Sauce',
      aisle: 'E3',
      shelf: 'Middle',
      section: 'Canned Goods',
    },
    {
      id: 'p009',
      name: 'Eggs - Dozen',
      aisle: 'A3',
      shelf: 'Bottom',
      section: 'Dairy',
    },
    {
      id: 'p010',
      name: 'Ice Cream - Vanilla',
      aisle: 'A6',
      shelf: 'Freezer',
      section: 'Frozen',
    },
  ],
};

export const stores = [demoStore];
