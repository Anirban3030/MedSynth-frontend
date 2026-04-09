import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import PipelinePage from './pages/PipelinePage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<SearchPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/results"  element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
