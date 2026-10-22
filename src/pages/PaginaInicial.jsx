import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import mensagemDeErro from "../erro";

function PaginaInicial() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");

  // Carrega as listas dos filtros (só uma vez)
  useEffect(function () {
    carregarListas();
  }, []);

  // Carrega os chamados de novo sempre que um filtro mudar
  useEffect(function () {
    carregarChamados();
  }, [busca, status, tipo, local, prioridade]);

  async function carregarListas() {
    try {
      const respostaTipos = await api.get("/tipos");
      const respostaLocais = await api.get("/locais");
      const respostaPrioridades = await api.get("/prioridades");
      setTipos(respostaTipos.data);
      setLocais(respostaLocais.data);
      setPrioridades(respostaPrioridades.data);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  async function carregarChamados() {
    setCarregando(true);

    // Só envia os filtros que foram preenchidos
    const params = {};
    if (busca) params.busca = busca;
    if (status) params.status = status;
    if (tipo) params.tipo = tipo;
    if (local) params.local = local;
    if (prioridade) params.prioridade = prioridade;

    try {
      const resposta = await api.get("/chamados", { params: params });
      setChamados(resposta.data);
      setErro("");
    } catch (e) {
      setChamados([]);
      setErro(mensagemDeErro(e));
    }
    setCarregando(false);
  }

  return (
    <div>
      <div className="topo-lista">
        <h2>Chamados</h2>
        <Link to="/novo" className="botao-link">+ Abrir chamado</Link>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={busca}
          onChange={function (e) { setBusca(e.target.value); }}
        />

        <select value={status} onChange={function (e) { setStatus(e.target.value); }}>
          <option value="">Status</option>
          <option value="aberto">aberto</option>
          <option value="em andamento">em andamento</option>
          <option value="resolvido">resolvido</option>
        </select>

        <select value={tipo} onChange={function (e) { setTipo(e.target.value); }}>
          <option value="">Tipo</option>
          {tipos.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <select value={local} onChange={function (e) { setLocal(e.target.value); }}>
          <option value="">Local</option>
          {locais.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <select value={prioridade} onChange={function (e) { setPrioridade(e.target.value); }}>
          <option value="">Prioridade</option>
          {prioridades.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>
      </div>

      {erro && <p className="erro">{erro}</p>}
      {carregando && <p>Carregando chamados...</p>}
      {!carregando && !erro && chamados.length === 0 && <p>Nenhum chamado encontrado.</p>}

      {!carregando && chamados.map(function (chamado) {
        return (
          <div className="card" key={chamado.id}>
            <h3><Link to={"/chamado/" + chamado.id}>{chamado.titulo}</Link></h3>
            <p>Status: {chamado.status} | Prioridade: {chamado.prioridade}</p>
            <p>{chamado.tipo} - {chamado.local}</p>
            <p>Aberto em: {chamado.data_abertura}</p>
          </div>
        );
      })}
    </div>
  );
}

export default PaginaInicial;
