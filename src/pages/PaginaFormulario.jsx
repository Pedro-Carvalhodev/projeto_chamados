import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import mensagemDeErro from "../erro";

// Se tem id na rota (/editar/:id) edita; senão (/novo) abre um chamado
function PaginaFormulario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");
  const [status, setStatus] = useState("");

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(function () {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      const respostaTipos = await api.get("/tipos");
      const respostaLocais = await api.get("/locais");
      const respostaPrioridades = await api.get("/prioridades");
      setTipos(respostaTipos.data);
      setLocais(respostaLocais.data);
      setPrioridades(respostaPrioridades.data);

      // Ao editar, preenche o formulário com o chamado
      if (id) {
        const resposta = await api.get("/chamados/" + id);
        const chamado = resposta.data;
        setTitulo(chamado.titulo);
        setDescricao(chamado.descricao);
        setTipo(chamado.tipo);
        setLocal(chamado.local);
        setPrioridade(chamado.prioridade);
        setDataAbertura(chamado.data_abertura);
        setStatus(chamado.status);
      }
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  async function salvar(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    const chamado = {
      titulo: titulo,
      descricao: descricao,
      tipo: tipo,
      local: local,
      prioridade: prioridade,
      data_abertura: dataAbertura,
    };

    try {
      if (id) {
        await api.put("/chamados/" + id, chamado);
        setSucesso("Chamado atualizado com sucesso!");
      } else {
        await api.post("/chamados", chamado);
        setSucesso("Chamado aberto com sucesso!");

        // Limpa o formulário para abrir outro chamado
        setTitulo("");
        setDescricao("");
        setTipo("");
        setLocal("");
        setPrioridade("");
        setDataAbertura("");
      }
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  if (status === "resolvido") {
    return (
      <div>
        <p className="erro">Chamados resolvidos não podem ser editados.</p>
        <Link to="/">← Voltar</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>{id ? "Editar chamado" : "Abrir chamado"}</h2>

      <form className="formulario" onSubmit={salvar}>
        <label>Título</label>
        <input type="text" value={titulo} onChange={function (e) { setTitulo(e.target.value); }} />

        <label>Descrição</label>
        <textarea rows="4" value={descricao} onChange={function (e) { setDescricao(e.target.value); }} />

        <label>Tipo</label>
        <select value={tipo} onChange={function (e) { setTipo(e.target.value); }}>
          <option value="">Selecione</option>
          {tipos.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <label>Local</label>
        <select value={local} onChange={function (e) { setLocal(e.target.value); }}>
          <option value="">Selecione</option>
          {locais.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <label>Prioridade</label>
        <select value={prioridade} onChange={function (e) { setPrioridade(e.target.value); }}>
          <option value="">Selecione</option>
          {prioridades.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <label>Data de abertura</label>
        <input type="date" value={dataAbertura} onChange={function (e) { setDataAbertura(e.target.value); }} />

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <div>
          <button type="submit">Salvar</button>
          <button type="button" onClick={function () { navigate(-1); }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default PaginaFormulario;
