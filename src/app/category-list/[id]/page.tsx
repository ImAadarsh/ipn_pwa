import type {Metadata} from 'next';

import {CategoryList} from './CategoryList';

type Params = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: 'Category Workshops',
  description: 'List of workshops by category',
};

export default function CategoryListPage({params}: Params) {
  return <CategoryList id={params.id} />;
}
