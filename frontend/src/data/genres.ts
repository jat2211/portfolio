export interface GenrePlaceholder {
  id: string;
  url: string;
  title: string;
}

export interface Genre {
  id: string;
  label: string;
  photos: GenrePlaceholder[];
}

export const genres: Genre[] = [
  {
    id: 'bw',
    label: 'Black and white',
    photos: [
      { id: 'bw-1', url: 'https://picsum.photos/seed/bw1/800/800', title: 'B&W 01' },
      { id: 'bw-2', url: 'https://picsum.photos/seed/bw2/800/800', title: 'B&W 02' },
      { id: 'bw-3', url: 'https://picsum.photos/seed/bw3/800/800', title: 'B&W 03' },
    ],
  },
  {
    id: 'portraits',
    label: 'Portraits',
    photos: [
      { id: 'port-1', url: 'https://picsum.photos/seed/port1/800/800', title: 'Portrait 01' },
      { id: 'port-2', url: 'https://picsum.photos/seed/port2/800/800', title: 'Portrait 02' },
      { id: 'port-3', url: 'https://picsum.photos/seed/port3/800/800', title: 'Portrait 03' },
    ],
  },
  {
    id: 'landscape',
    label: 'Landscape',
    photos: [
      { id: 'land-1', url: 'https://picsum.photos/seed/land1/800/800', title: 'Landscape 01' },
      { id: 'land-2', url: 'https://picsum.photos/seed/land2/800/800', title: 'Landscape 02' },
      { id: 'land-3', url: 'https://picsum.photos/seed/land3/800/800', title: 'Landscape 03' },
    ],
  },
  {
    id: 'street',
    label: 'Street',
    photos: [
      { id: 'street-1', url: 'https://picsum.photos/seed/street1/800/800', title: 'Street 01' },
      { id: 'street-2', url: 'https://picsum.photos/seed/street2/800/800', title: 'Street 02' },
      { id: 'street-3', url: 'https://picsum.photos/seed/street3/800/800', title: 'Street 03' },
    ],
  },
];
