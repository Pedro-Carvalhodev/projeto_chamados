import { Routes, Route } from "react-router-dom";
import "./App.css";
import Cabecalho from "./components/Cabecalho";
import PaginaInicial from "./pages/PaginaInicial";
import PaginaDetalhe from "./pages/PaginaDetalhe";
import PaginaFormulario from "./pages/PaginaFormulario";

function App() {
  return (
    <div className="App">
      <Cabecalho />
      <Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route path="/chamado/:id" element={<PaginaDetalhe />} />
        <Route path="/novo" element={<PaginaFormulario key="novo" />} />
        <Route path="/editar/:id" element={<PaginaFormulario key="editar" />} />
      </Routes>
    </div>
  );
}

export default App;
