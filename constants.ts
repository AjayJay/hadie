
import type { ServiceCategory } from './types';
import { HomeIcon, SparklesIcon, WrenchScrewdriverIcon } from './components/Icon';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-1',
    name: 'Home Cleaning',
    icon: HomeIcon,
    services: [
      { id: 'serv-1a', name: 'Full Home Deep Clean', description: 'Comprehensive cleaning for your entire home.', price: 120, duration: '4-5 hours' },
      { id: 'serv-1b', name: 'Bathroom & Kitchen Cleaning', description: 'Intensive cleaning for wet areas.', price: 70, duration: '2 hours' },
      { id: 'serv-1c', name: 'Sofa & Carpet Shampooing', description: 'Removes deep-seated dirt and stains.', price: 90, duration: '3 hours' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Salon for Women',
    icon: SparklesIcon,
    services: [
      { id: 'serv-2a', name: 'Deluxe Manicure & Pedicure', description: 'Complete pampering for your hands and feet.', price: 60, duration: '1.5 hours' },
      { id: 'serv-2b', name: 'Hydrating Facial', description: 'Rejuvenate your skin with our special treatment.', price: 80, duration: '1 hour' },
      { id: 'serv-2c', name: 'Hair Spa & Styling', description: 'Get a fresh new look.', price: 100, duration: '2 hours' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Appliance Repair',
    icon: WrenchScrewdriverIcon,
    services: [
      { id: 'serv-3a', name: 'Air Conditioner Servicing', description: 'Ensure your AC runs cool and efficiently.', price: 50, duration: '1 hour' },
      { id: 'serv-3b', name: 'Washing Machine Repair', description: 'Fixing all common washing machine issues.', price: 65, duration: '1-2 hours' },
      { id: 'serv-3c', name: 'Refrigerator Check-up', description: 'Preventive maintenance and repair.', price: 55, duration: '1 hour' },
    ],
  },
];
