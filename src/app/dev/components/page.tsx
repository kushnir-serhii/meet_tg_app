import { notFound } from 'next/navigation';

import { ComponentGallery } from '@/components/dev/ComponentGallery';

/** Component gallery for desktop review. Only exists in `next dev`. */
const DevComponentsPage = () => {
  if (process.env.NODE_ENV === 'production') notFound();
  return <ComponentGallery />;
};

export default DevComponentsPage;
