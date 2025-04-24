// // app/cv/page.tsx (ou pages/cv.tsx si tu n’utilises pas le système d’app directory)
// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Calendar } from 'lucide-react';

// const mockCVs = [
//   { id: 'cv001', nom: 'Ali Meziane', poste: 'Développeur', date: '2025-04-10', statut: 'Reçu' },
//   { id: 'cv002', nom: 'Sara Bouzid', poste: 'Designer UX', date: '2025-04-15', statut: 'En attente' },
// ];

// const months = [
//   'Janvier', 'Février', 'Mars', 'Avril',
//   'Mai', 'Juin', 'Juillet', 'Août',
//   'Septembre', 'Octobre', 'Novembre', 'Décembre'
// ];

// export default function GestionCV() {
//   const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
//   const [filteredCVs, setFilteredCVs] = useState(mockCVs);

//   useEffect(() => {
//     // Simule le filtrage par mois (ici en local)
//     const filtered = mockCVs.filter((cv) => new Date(cv.date).getMonth() === selectedMonth);
//     setFilteredCVs(filtered);
//   }, [selectedMonth]);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Gestion des CV - {months[selectedMonth]}</h1>
//         <Button>➕ Ajouter un CV</Button>
//       </div>

//       <div className="flex space-x-2 mb-4 overflow-x-auto">
//         {months.map((month, index) => (
//           <Button
//             key={month}
//             variant={index === selectedMonth ? 'default' : 'outline'}
//             onClick={() => setSelectedMonth(index)}
//           >
//             {month}
//           </Button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredCVs.length === 0 ? (
//           <p className="text-gray-500">Aucun CV ce mois-ci.</p>
//         ) : (
//           filteredCVs.map((cv) => (
//             <Card key={cv.id} className="rounded-2xl shadow-md">
//               <CardContent className="p-4 space-y-2">
//                 <h2 className="text-xl font-semibold">{cv.nom}</h2>
//                 <p className="text-sm text-gray-600">Poste : {cv.poste}</p>
//                 <p className="text-sm text-gray-500">Statut : {cv.statut}</p>
//                 <p className="text-xs text-gray-400">Date : {cv.date}</p>
//                 <div className="flex space-x-2 mt-2">
//                   <Button variant="outline" size="sm">📄 Voir</Button>
//                   <Button variant="ghost" size="sm">⬇️ Télécharger</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
