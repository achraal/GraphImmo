import { HashRouter, Routes, Route } from 'react-router-dom'
import ProprietesMap from './components/Map'
import ProprieteDetail from './components/ProprieteDetail'
import Search from "./components/Search"
import Navbar from "./components/Navbar"

function App() {
  return (
     
    <HashRouter>  {/* Wrap tout l'app */}
    <Navbar />
      <div style={{ padding: 24 }}>
        <h1>GraphImmo – Carte MapLibre</h1>
        <Routes>
          <Route path="/" element={<ProprietesMap />} />
          <Route path="/recherche" element={<Search />} />
          <Route path="/propriete/:id" element={<ProprieteDetail />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
