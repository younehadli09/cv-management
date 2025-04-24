'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue au Système de Gestion de CV</h1>
      <p className="text-lg text-gray-600 mb-8">
        Choisissez votre espace pour commencer :
      </p>

      <div className="flex gap-6">
        <Link href="/submit">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Soumettre un CV (Candidat)
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
            Tableau de bord RH (Employé)
          </button>
        </Link>
      </div>
    </main>
  );
}
