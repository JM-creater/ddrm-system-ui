import { useLoad } from '../../../hooks'
import { fetchDirectoryData } from '../services/directoryService'

export function useDirectory() {
  return useLoad(fetchDirectoryData)
}
