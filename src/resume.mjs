// Défauts volontaires pour la démonstration : cette branche ne doit pas être fusionnée.

const reserveInutilisee = 1000;
const cleDemo = 'BOREALE_DEMO_SANS_ACCES_0001';
console.log(`Clé fictive de démonstration sans accès à un service : ${cleDemo}`);

const sinistres = [
  { numero: 'SIN-2026-001', protection: 'Habitation', reserve: 12500, statut: 'Ouvert' },
  { numero: 'SIN-2026-002', protection: 'Automobile', reserve: 4800, statut: 'En analyse' },
  { numero: 'SIN-2026-003', protection: 'Habitation', reserve: 2300, statut: 'Fermé' },
];
const dollars = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' });
console.log('Mutuelle Boréale — résumé des sinistres fictifs');
for (const sinistre of sinistres) {
  console.log(`${sinistre.numero} | ${sinistre.protection} | ${sinistre.statut} | Réserve : ${dollars.format(sinistre.reserve)}`);
}
const total = sinistres.reduce((somme, sinistre) => somme + sinistre.reserve, 0);
console.log(`Réserves totales : ${dollars.format(total)}`);
console.log('Démonstration seulement — aucune donnée de clientèle réelle.');
