'use client';

import { useEffect, useState } from 'react';

interface CV {
  id: number;
  xml_data: string;
}

interface SearchResult {
  cv_id: number;
  matches: {
    match: string;
    match_type: string;
    parent?: string;
  }[];
}

export default function Dashboard() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCv, setSelectedCv] = useState<{id: number, html: string} | null>(null);
  const [xpath, setXpath] = useState('');
  const [filterResults, setFilterResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllCVs();
  }, []);

  const fetchAllCVs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/all_cvs');
      const text = await res.text();
      
      // Parse the HTML response to extract CV data
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const rows = doc.querySelectorAll('tbody tr');
      
      const cvData = Array.from(rows).map(row => {
        const id = row.querySelector('td:first-child')?.textContent;
        return {
          id: Number(id),
          xml_data: '' // We don't need the full XML here
        };
      });
      
      setCvs(cvData);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCV = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/view_cv/${id}`);
      const html = await res.text();
      setSelectedCv({id, html});
    } catch (error) {
      console.error('Error fetching CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "xpath_query": xpath })
      });
      const data = await res.json();
      setFilterResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CV Database</h1>

      {/* Search Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
        <input
            type="text"
            placeholder="Enter XPath query (e.g., //experience[@poste='Developer'])"
            value={xpath}
            onChange={(e) => setXpath(e.target.value)}
            className="flex-1 border p-2 rounded text-gray-800 bg-white" // Added text-gray-800 and bg-white
          />
          <button 
            onClick={handleSearch} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* CV Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">All CVs</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !cvs.length ? (
                <tr>
                  <td colSpan={3} className="border p-3 text-center">Loading CVs...</td>
                </tr>
              ) : cvs.map((cv) => (
                <tr key={cv.id} className="hover:bg-gray-50">
                  <td className="border p-3">{cv.id}</td>
                  <td className="border p-3">CV {cv.id}</td>
                  <td className="border p-3">
                    <button
                      onClick={() => handleViewCV(cv.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                      disabled={loading}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected CV View */}
      {selectedCv && (
        <div className="mt-8 p-6 border rounded-lg bg-white shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">CV Details (ID: {selectedCv.id})</h2>
            <button 
              onClick={() => setSelectedCv(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div 
            className="cv-content"
            dangerouslySetInnerHTML={{ __html: selectedCv.html }}
          />
        </div>
      )}

      {/* Search Results */}
      {filterResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Search Results</h2>
          <div className="space-y-4">
  {filterResults.map((result, i) => (
    <div key={i} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="font-bold text-lg mb-2 dark:text-white">CV ID: {result.cv_id}</h3>
      <div className="space-y-3">
        {result.matches.map((match, j) => (
          <div key={j} className="p-3 bg-white dark:bg-gray-700 rounded border dark:border-gray-600">
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
              Match type: {match.match_type}
            </div>
            <pre className="p-2 bg-gray-100 dark:bg-gray-600 rounded overflow-auto text-sm text-gray-800 dark:text-gray-200">
              {match.match}
            </pre>
            {match.parent && (
              <>
                <div className="text-sm text-gray-500 dark:text-gray-300 mt-2 mb-1">
                  Parent context:
                </div>
                <pre className="p-2 bg-gray-100 dark:bg-gray-600 rounded overflow-auto text-sm text-gray-800 dark:text-gray-200">
                  {match.parent}
                </pre>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
        </div>
      )}
    </div>
  );
}