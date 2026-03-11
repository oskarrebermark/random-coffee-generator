import Papa from 'papaparse'

export interface Participant {
  name: string
  email: string
  department: string
}

export function parseCSV(
  file: File,
  onSuccess: (participants: Participant[]) => void,
  onError: (message: string) => void
) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const data = results.data as Participant[]
      const valid = data.filter((row) => row.name && row.email && row.department)
      if (valid.length < 2) {
        onError('Need at least 2 valid participants with name, email, and department columns.')
        return
      }
      onSuccess(valid)
    },
    error: () => onError('Failed to parse file. Make sure it is a valid CSV.'),
  })
}
