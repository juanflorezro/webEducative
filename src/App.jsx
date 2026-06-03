import './App.css'






//Recursos
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from './pages'
import Nav from './pages/nav'
import Login from './pages/login'
import Cursos from './pages/cursos'
import About from './pages/about'
import LinearIntersection from './pages/linearIntersection'
import Examen from './pages/examen'
import Admin from './pages/admin'


function App() {

  return (
    <>
      <Nav />
      <BrowserRouter>
        
            <div className="contenedor">
              <Routes>
                <Route index element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/servicios" element={<Cursos />} />
                <Route path="/about" element={<About />} />
                <Route path="/examen" element={<Examen />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/calculofuncionlineal" element={<LinearIntersection />} />
              </Routes>
            </div>
      </BrowserRouter>
    </>
  )
}

export default App
