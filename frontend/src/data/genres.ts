export interface GenrePlaceholder {
  id: string;
  url: string;
  title: string;
  width?: number;
  height?: number;
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
      { id: 'bw-1', url: 'https://picsum.photos/seed/bw1/900/1200', title: 'B&W 01', width: 900, height: 1200 },
      { id: 'bw-2', url: 'https://picsum.photos/seed/bw2/1400/850', title: 'B&W 02', width: 1400, height: 850 },
      { id: 'bw-3', url: 'https://picsum.photos/seed/bw3/1100/1100', title: 'B&W 03', width: 1100, height: 1100 },
    ],
  },
  {
    id: 'portraits',
    label: 'Portraits',
    photos: [
      { id: 'port-1', url: 'https://picsum.photos/seed/port1/900/1300', title: 'Portrait 01', width: 900, height: 1300 },
      { id: 'port-2', url: 'https://picsum.photos/seed/port2/1600/900', title: 'Portrait 02', width: 1600, height: 900 },
      { id: 'port-3', url: 'https://picsum.photos/seed/port3/850/1100', title: 'Portrait 03', width: 850, height: 1100 },
    ],
  },
  {
    id: 'landscape',
    label: 'Landscape',
    photos: [
      { id: 'land-1', url: 'https://picsum.photos/seed/land1/1500/880', title: 'Landscape 01', width: 1500, height: 880 },
      { id: 'land-2', url: 'https://picsum.photos/seed/land2/1200/1200', title: 'Landscape 02', width: 1200, height: 1200 },
      { id: 'land-3', url: 'https://picsum.photos/seed/land3/1300/820', title: 'Landscape 03', width: 1300, height: 820 },
    ],
  },
  {
    id: 'street',
    label: 'Street',
    photos: [
      { id: 'street-1', url: 'https://picsum.photos/seed/street1/920/1180', title: 'Street 01', width: 920, height: 1180 },
      { id: 'street-2', url: 'https://picsum.photos/seed/street2/1450/900', title: 'Street 02', width: 1450, height: 900 },
      { id: 'street-3', url: 'https://picsum.photos/seed/street3/1000/1000', title: 'Street 03', width: 1000, height: 1000 },
    ],
  },
];
