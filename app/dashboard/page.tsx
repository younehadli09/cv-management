'use client';

import { useEffect, useState } from 'react';

interface CV {
  id: number;
  xml_data: string;
}

export default function Dashboard() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCv, setSelectedCv] = useState<string | null>(null);
  const [xpath, setXpath] = useState('');
  const [filterResults, setFilterResults] = useState<any[]>([]);

  useEffect(() => {
    fetchAllCVs();
  }, []);

  const fetchAllCVs = async () => {
    const res = await fetch('http://172.20.10.4:5000/get_cv/1'); // Tu peux faire un endpoint qui retourne tous les CV aussi
    const data = await res.json();
    setCvs([data]); // Modifie pour plusieurs CV si backend est prêt
  };

  const handleSearch = async () => {
    const res = await fetch('http://172.20.10.4:5000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "xpath_query": xpath })
    });
    const data = await res.json();
    setFilterResults(data.results || []);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Table des CVs</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrer par XPath"
          value={xpath}
          onChange={(e) => setXpath(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white p-2 rounded">Rechercher</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {cvs.map((cv) => (
            <tr key={cv.id}>
              <td className="border p-2">{cv.id}</td>
              <td className="border p-2">
                <button
                  onClick={() => setSelectedCv(cv.xml_data)}
                  className="bg-green-600 text-white p-1 rounded"
                >
                  Voir le CV
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCv && (
        <div className="mt-6 p-4 border bg-gray-100 whitespace-pre-wrap overflow-auto">
          <h2 className="text-xl font-semibold mb-2">CV XML</h2>
          <code>{selectedCv}</code>
        </div>
      )}

      {filterResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Résultats de recherche</h2>
          {filterResults.map((res, i) => (
            <div key={i} className="mb-4 p-4 border bg-white">
              <h3 className="font-bold">CV ID: {res.cv_id}</h3>
              {res.matches.map((match: string, j: number) => (
                <pre key={j} className="bg-gray-100 p-2 mt-2 overflow-auto">{match}</pre>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
