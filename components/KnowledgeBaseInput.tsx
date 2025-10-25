
import React, { useState, useCallback, ChangeEvent } from 'react';
import { UploadIcon, BrainCircuitIcon } from './icons';

interface KnowledgeBaseInputProps {
  onKnowledgeBaseSet: (text: string) => void;
}

const KnowledgeBaseInput: React.FC<KnowledgeBaseInputProps> = ({ onKnowledgeBaseSet }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setText(fileContent);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (text.trim()) {
      onKnowledgeBaseSet(text.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
            <BrainCircuitIcon />
        </div>
        <h1 className="text-3xl font-bold text-white">Kennisbank AI Assistent</h1>
        <p className="text-gray-300 mt-2">Upload een .txt bestand of plak de inhoud om uw AI-assistent te initialiseren.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="knowledge-base" className="block text-sm font-medium text-gray-200 mb-2">
            Plak uw kennisbank hier:
          </label>
          <textarea
            id="knowledge-base"
            rows={10}
            className="w-full p-3 bg-gray-900/50 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Plak de inhoud van uw document hier..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center text-gray-400">
          <span className="flex-grow border-t border-gray-700"></span>
          <span className="mx-4">OF</span>
          <span className="flex-grow border-t border-gray-700"></span>
        </div>
        <div>
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg inline-flex items-center justify-center w-full transition duration-200"
          >
            <UploadIcon />
            <span>Kies een .txt bestand</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt" onChange={handleFileChange} />
          </label>
          {fileName && <p className="text-center text-sm text-gray-400 mt-3">Geselecteerd bestand: {fileName}</p>}
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg flex items-center justify-center shadow-lg"
        >
          Start Chat
        </button>
      </form>
    </div>
  );
};

export default KnowledgeBaseInput;
