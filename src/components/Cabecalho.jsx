import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Cabecalho() {
  const [nome, setNome] = useState("");

  useEffect(function () {
    carregarNome();
  }, []);

  async function carregarNome() {
    try {
      const resposta = await api.get("/eu");
      setNome(resposta.data.nome);
    } catch (e) {
      setNome("");
    }
  }

  return (
    <header className="cabecalho">
      <h1>Chamados de Manutenção</h1>
      <nav>
        <Link to="/">Chamados</Link>
        <Link to="/novo">+ Abrir chamado</Link>
      </nav>
      <span>{nome ? "Olá, " + nome : "Olá."}</span>
    </header>
  );
}

export default Cabecalho;
