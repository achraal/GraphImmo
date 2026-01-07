import { createContext, useContext, useState } from 'react'
import { ReactNode } from 'react'

type SearchState = {
  modeActif: 'aucun' | 'localisation' | 'tri'
  results: any[]
  formData: any
}

const SearchContext = createContext<{
  searchState: SearchState
  setSearchState: (state: SearchState) => void
} | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchState, setSearchState] = useState<SearchState>({
    modeActif: 'aucun',
    results: [],
    formData: {}
  })

  return (
    <SearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (!context) throw new Error('useSearchContext doit être dans SearchProvider')
  return context
}
