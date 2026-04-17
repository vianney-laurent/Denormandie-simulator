import { City, Zone } from './types';

export const CITIES: City[] = [
  // Zone A bis
  { name: 'Paris', zone: 'A bis' },

  // Zone A
  { name: 'Ajaccio', zone: 'A' },
  { name: 'Annecy', zone: 'A' },
  { name: 'Bayonne', zone: 'A' },
  { name: 'Bordeaux', zone: 'A' },
  { name: 'Chambéry', zone: 'A' },
  { name: 'Cluses', zone: 'A' },
  { name: 'Fréjus', zone: 'A' },
  { name: 'Grenoble', zone: 'A' },
  { name: 'La Rochelle', zone: 'A' },
  { name: 'Le Havre', zone: 'A' },
  { name: 'Lyon', zone: 'A' },
  { name: 'Marseille', zone: 'A' },
  { name: 'Metz', zone: 'A' },
  { name: 'Montpellier', zone: 'A' },
  { name: 'Nancy', zone: 'A' },
  { name: 'Nantes', zone: 'A' },
  { name: 'Nice', zone: 'A' },
  { name: 'Nîmes', zone: 'A' },
  { name: 'Rennes', zone: 'A' },
  { name: 'Saint-Nazaire', zone: 'A' },
  { name: 'Strasbourg', zone: 'A' },
  { name: 'Thonon-les-Bains', zone: 'A' },
  { name: 'Toulon', zone: 'A' },
  { name: 'Toulouse', zone: 'A' },
  { name: 'Tours', zone: 'A' },

  // Zone B1
  { name: 'Amiens', zone: 'B1' },
  { name: 'Angers', zone: 'B1' },
  { name: 'Avignon', zone: 'B1' },
  { name: 'Besançon', zone: 'B1' },
  { name: 'Brest', zone: 'B1' },
  { name: 'Caen', zone: 'B1' },
  { name: 'Clermont-Ferrand', zone: 'B1' },
  { name: 'Dijon', zone: 'B1' },
  { name: 'Dunkerque', zone: 'B1' },
  { name: 'Le Mans', zone: 'B1' },
  { name: 'Lens', zone: 'B1' },
  { name: 'Limoges', zone: 'B1' },
  { name: 'Lorient', zone: 'B1' },
  { name: 'Mulhouse', zone: 'B1' },
  { name: 'Orléans', zone: 'B1' },
  { name: 'Pau', zone: 'B1' },
  { name: 'Perpignan', zone: 'B1' },
  { name: 'Poitiers', zone: 'B1' },
  { name: 'Reims', zone: 'B1' },
  { name: 'Rouen', zone: 'B1' },
  { name: 'Saint-Étienne', zone: 'B1' },
  { name: 'Valence', zone: 'B1' },
  { name: 'Valenciennes', zone: 'B1' },

  // Zone B2
  { name: 'Agen', zone: 'B2' },
  { name: 'Albi', zone: 'B2' },
  { name: 'Alençon', zone: 'B2' },
  { name: 'Arras', zone: 'B2' },
  { name: 'Auxerre', zone: 'B2' },
  { name: 'Belfort', zone: 'B2' },
  { name: 'Béziers', zone: 'B2' },
  { name: 'Blois', zone: 'B2' },
  { name: 'Bourges', zone: 'B2' },
  { name: 'Brive-la-Gaillarde', zone: 'B2' },
  { name: 'Calais', zone: 'B2' },
  { name: 'Carcassonne', zone: 'B2' },
  { name: 'Châlons-en-Champagne', zone: 'B2' },
  { name: 'Charleville-Mézières', zone: 'B2' },
  { name: 'Châteauroux', zone: 'B2' },
  { name: 'Cherbourg-en-Cotentin', zone: 'B2' },
  { name: 'Colmar', zone: 'B2' },
  { name: 'Épinal', zone: 'B2' },
  { name: 'Évreux', zone: 'B2' },
  { name: 'Laval', zone: 'B2' },
  { name: 'Mâcon', zone: 'B2' },
  { name: 'Montauban', zone: 'B2' },
  { name: 'Montélimar', zone: 'B2' },
  { name: 'Nevers', zone: 'B2' },
  { name: 'Niort', zone: 'B2' },
  { name: 'Périgueux', zone: 'B2' },
  { name: 'Quimper', zone: 'B2' },
  { name: 'Rodez', zone: 'B2' },
  { name: 'Roanne', zone: 'B2' },
  { name: 'Saint-Brieuc', zone: 'B2' },
  { name: 'Saint-Malo', zone: 'B2' },
  { name: 'Saintes', zone: 'B2' },
  { name: 'Tarbes', zone: 'B2' },
  { name: 'Troyes', zone: 'B2' },
  { name: 'Tulle', zone: 'B2' },
  { name: 'Vannes', zone: 'B2' },
  { name: 'Vienne', zone: 'B2' },
  { name: 'Villefranche-sur-Saône', zone: 'B2' },
];

export function searchCities(query: string): City[] {
  const normalized = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return CITIES.filter(city =>
    city.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes(normalized)
  ).slice(0, 10);
}
