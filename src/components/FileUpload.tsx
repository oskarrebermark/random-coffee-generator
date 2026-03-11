import type { Participant } from '../utils/parseCSV'
import { parseCSV } from '../utils/parseCSV'

interface Props {
  onParsed: (participants: Participant[]) => void
  onError: (message: string) => void
  fileName: string
  setFileName: (name: string) => void
}

export default function FileUpload({ onParsed, onError, fileName, setFileName }: Props) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    parseCSV(file, onParsed, onError)
  }

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-stone-300">
        Upload CSV file
      </label>
      <p className="text-xs text-stone-500 mb-4">
        Required columns: <code className="text-amber-400">name</code>,{' '}
        <code className="text-amber-400">email</code>,{' '}
        <code className="text-amber-400">department</code>
      </p>
      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-stone-600 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-stone-800 transition-all">
        <span className="text-3xl mb-2">📂</span>
        <span className="text-sm text-stone-400">
          {fileName ? fileName : 'Click to select a CSV file'}
        </span>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  )
}
