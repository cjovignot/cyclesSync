import { FileText } from "lucide-react";

interface NotesInputProps {
  notes: string;
  onChange: (notes: string) => void;
}

export function NotesInput({ notes, onChange }: NotesInputProps) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
        <h4 className="font-medium text-gray-900 dark:text-white">
          Notes personnelles
        </h4>
      </div>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ajoutez vos observations personnelles..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
      />
    </div>
  );
}
