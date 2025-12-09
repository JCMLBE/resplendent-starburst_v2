import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Initialiseer PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Import UploadIcon component manually since we cannot easily import it from icons.tsx if not exported or if we want to avoid circular deps. 
// Assuming icons.tsx has it, we should try to import it.
import { UploadIcon } from './icons';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [knowledgeBase, setKnowledgeBase] = useState<string>('');
  const [systemInstructions, setSystemInstructions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if already authenticated
    const authToken = sessionStorage.getItem('admin_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [kbResponse, siResponse] = await Promise.all([
        fetch('/api/admin-get-knowledge-base'),
        fetch('/api/admin-get-system-instructions')
      ]);

      if (kbResponse.ok) {
        const kbData = await kbResponse.json();
        setKnowledgeBase(kbData.content);
      }

      if (siResponse.ok) {
        const siData = await siResponse.json();
        setSystemInstructions(siData.instructions);
      }
    } catch (e: any) {
      setError('Fout bij het laden van gegevens: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        sessionStorage.setItem('admin_auth', 'authenticated');
        setIsAuthenticated(true);
        setPassword('');
        await loadAdminData();
      } else {
        const data = await response.json();
        setError(data.error || 'Onjuist wachtwoord');
      }
    } catch (e: any) {
      setError('Fout bij authenticatie: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveKnowledgeBase = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin-update-knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: knowledgeBase })
      });

      if (response.ok) {
        setMessage('Kennisbank succesvol bijgewerkt!');
      } else {
        const data = await response.json();
        setError(data.error || 'Fout bij het opslaan');
      }
    } catch (e: any) {
      setError('Fout bij het opslaan: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInstructions = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin-update-system-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: systemInstructions })
      });

      if (response.ok) {
        setMessage('Systeem instructies succesvol bijgewerkt!');
      } else {
        const data = await response.json();
        setError(data.error || 'Fout bij het opslaan');
      }
    } catch (e: any) {
      setError('Fout bij het opslaan: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setKnowledgeBase('');
    setSystemInstructions('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-highlight"
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-highlight hover:bg-highlight-hover text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Bezig...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">ORBINITE® AI Admin</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Uitloggen
            </button>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-highlight/20 border border-highlight text-white rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Knowledge Base Section */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Kennisbank Context</h2>
              <p className="text-gray-400 mb-4">
                Bewerk de kennisbank die de AI gebruikt om vragen te beantwoorden.
              </p>
              <textarea
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                className="w-full h-64 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-highlight font-mono text-sm"
                disabled={isLoading}
              />

              <div className="mt-4 flex items-center gap-4">
                <label
                  className={`flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <UploadIcon />
                  <span>Upload Bestand (.txt, .pdf)</span>
                  <input
                    type="file"
                    accept=".txt,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setIsLoading(true);
                      setError('');

                      try {
                        if (file.type === 'application/pdf') {
                          const arrayBuffer = await file.arrayBuffer();
                          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                          let fullText = '';

                          for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map((item: any) => item.str).join(' ');
                            fullText += pageText + '\n\n';
                          }

                          setKnowledgeBase(prev => prev + (prev ? '\n\n' : '') + fullText.trim());
                          setMessage(`PDF "${file.name}" succesvol toegevoegd!`);
                        } else {
                          // Default to text handling
                          const text = await file.text();
                          setKnowledgeBase(prev => prev + (prev ? '\n\n' : '') + text.trim());
                          setMessage(`Bestand "${file.name}" succesvol toegevoegd!`);
                        }
                      } catch (err: any) {
                        console.error('File upload error:', err);
                        setError('Fout bij het lezen van bestand: ' + err.message);
                      } finally {
                        setIsLoading(false);
                        // Reset input
                        e.target.value = '';
                      }
                    }}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-400 text-sm">Voegt inhoud toe aan bestaande tekst</span>
              </div>

              <button
                onClick={handleSaveKnowledgeBase}
                disabled={isLoading}
                className="mt-4 bg-highlight hover:bg-highlight-hover text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Bezig...' : 'Kennisbank Opslaan'}
              </button>
            </div>

            {/* System Instructions Section */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Systeem Instructies</h2>
              <p className="text-gray-400 mb-4">
                Bewerk de instructies die bepalen hoe de AI zich gedraagt en antwoordt.
              </p>
              <textarea
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                className="w-full h-64 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-highlight font-mono text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSaveInstructions}
                disabled={isLoading}
                className="mt-4 bg-highlight hover:bg-highlight-hover text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Bezig...' : 'Instructies Opslaan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
