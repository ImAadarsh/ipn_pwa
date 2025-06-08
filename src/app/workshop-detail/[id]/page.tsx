import type {Metadata, Viewport} from 'next';
import {theme} from '../../../constants';
import {CourseDetails} from './workshopDetail';
import {URLS} from '../../../config';

const BASE_URL = process.env.NEXT_PUBLIC_MAIN_URL || 'https://app.ipnacademy.in';

async function getWorkshopData(id: string) {
  try {
    console.log(`Fetching workshop data for ID: ${id} from ${URLS.MAIN_URL}/api/workshops/${id}`);
    const response = await fetch(`${URLS.MAIN_URL}/api/workshops/${id}`, {
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Workshop data fetched:', data);
    return data.workshop; // Return the nested workshop object directly
  } catch (error) {
    console.error('Error fetching workshop data:', error);
    return null;
  }
}

export async function generateMetadata({params}: {params: {id: string}}): Promise<Metadata> {
  const workshop = await getWorkshopData(params.id);
  
  console.log('Workshop object in generateMetadata:', workshop);

  // Define metadataBase here using BASE_URL
  const metadataBase = new URL(BASE_URL);

  if (!workshop) {
    return {
      metadataBase,
      title: 'IPN Academy | Workshop Details',
      description: 'Explore professional workshops and enhance your skills with IPN Academy.',
    };
  }

  return {
    metadataBase,
    title: `${workshop.name} | IPN Academy Workshop`,
    description: workshop.description || `Join our ${workshop.name} workshop to enhance your professional skills. Expert-led training with practical insights.`,
    keywords: `${workshop.name}, workshop, professional training, ${workshop.trainer_name || 'expert-led'}, IPN Academy`,
    openGraph: {
      title: `${workshop.name} | IPN Academy Workshop`,
      description: workshop.description || `Join our ${workshop.name} workshop to enhance your professional skills.`,
      url: `${BASE_URL}/workshop-detail/${params.id}`,
      siteName: 'IPN Academy',
      images: [
        {
          url: `${URLS.IMAGE_URL}${workshop.image.startsWith('public/') ? workshop.image : `public/img/workshop/${workshop.image}`}`,
          width: 1200,
          height: 630,
          alt: workshop.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${workshop.name} | IPN Academy Workshop`,
      description: workshop.description || `Join our ${workshop.name} workshop to enhance your professional skills.`,
      images: [`${URLS.IMAGE_URL}${workshop.image.startsWith('public/') ? workshop.image : `public/img/workshop/${workshop.image}`}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: theme.colors.white,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

type Params = {
  params: Promise<{id: string}>;
};

export default async function CourseDetailsPage({params}: Params) {
  const id = (await params).id;
  return <CourseDetails id={id} />;
}
