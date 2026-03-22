import type { Photo } from '../types';

/** Mixed sizes/orientations; seeds unchanged so images stay stable. */
export const mockPhotos: Photo[] = [
  { id: '1', url: 'https://picsum.photos/seed/a/900/1200', title: 'Untitled 01', width: 900, height: 1200 },
  { id: '2', url: 'https://picsum.photos/seed/b/1400/850', title: 'Untitled 02', width: 1400, height: 850 },
  { id: '3', url: 'https://picsum.photos/seed/c/900/1200', title: 'Untitled 03', width: 900, height: 1200 },
  { id: '4', url: 'https://picsum.photos/seed/d/1600/900', title: 'Untitled 04', width: 1600, height: 900 },
  { id: '5', url: 'https://picsum.photos/seed/e/1300/820', title: 'Untitled 05', width: 1300, height: 820 },
  { id: '6', url: 'https://picsum.photos/seed/f/850/1100', title: 'Untitled 06', width: 850, height: 1100 },
  { id: '7', url: 'https://picsum.photos/seed/g/1500/880', title: 'Untitled 07', width: 1500, height: 880 },
  { id: '8', url: 'https://picsum.photos/seed/h/1200/780', title: 'Untitled 08', width: 1200, height: 780 },
  { id: '9', url: 'https://picsum.photos/seed/i/900/1150', title: 'Untitled 09', width: 900, height: 1150 },
  { id: '10', url: 'https://picsum.photos/seed/j/1450/900', title: 'Untitled 10', width: 1450, height: 900 },
  { id: '11', url: 'https://picsum.photos/seed/k/1380/840', title: 'Untitled 11', width: 1380, height: 840 },
  { id: '12', url: 'https://picsum.photos/seed/l/880/1120', title: 'Untitled 12', width: 880, height: 1120 },
  { id: '13', url: 'https://picsum.photos/seed/m/1550/920', title: 'Untitled 13', width: 1550, height: 920 },
  { id: '14', url: 'https://picsum.photos/seed/n/1250/800', title: 'Untitled 14', width: 1250, height: 800 },
  { id: '15', url: 'https://picsum.photos/seed/o/920/1180', title: 'Untitled 15', width: 920, height: 1180 },
];

export const featuredPhoto = mockPhotos[0]!;
export const galleryPhotos = mockPhotos.slice(1);
