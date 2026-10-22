import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import mensagemDeErro from "../erro";

function PaginaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [responsavel, setResponsavel] = useState("");
  const [solucao, setSolucao] = useState("");

  useEffect(function () {
    carregarChamado();
  }, [id]);

  async function carregarChamado() {
    try {
      const resposta = await api.get("/chamados/" + id);
      setChamado(resposta.data);
      setErro("");
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
    setCarregando(false);
  }

  async function iniciar() {
    try {
      await api.patch("/chamados/" + id + "/iniciar", { responsavel: responsavel });
      carregarChamado();
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  async function resolver() {
    try {
      await api.patch("/chamados/" + id + "/resolver", { solucao: solucao });
      carregarChamado();
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  async function excluir() {
    try {
      await api.delete("/chamados/" + id);
      navigate("/");
    } catch (e) {
      setErro(mensagemDeErro(e));
      setConfirmando(false);
    }
  }

  if (carregando) {
    return <p>Carregando chamado...</p>;
  }

  return (
    <div>
      <Link to="/">← Voltar</Link>
      {erro && <p className="erro">{erro}</p>}

      {chamado && (
        <div className="card">
          <h2>{chamado.titulo}</h2>
          <p>Status: {chamado.status} | Prioridade: {chamado.prioridade}</p>
          <p>Descrição: {chamado.descricao}</p>
          <p>Tipo: {chamado.tipo}</p>
          <p>Local: {chamado.local}</p>
          <p>Aberto em: {chamado.data_abertura}</p>
          <p>Responsável: {chamado.responsavel}</p>
          <p>Solução: {chamado.solucao}</p>

          {chamado.status !== "resolvido" && (
            <Link to={"/editar/" + chamado.id} className="botao-link">Editar</Link>
          )}
          <button className="botao-excluir" onClick={function () { setConfirmando(true); }}>Excluir</button>

          {confirmando && (
            <div className="caixa">
              <p>Tem certeza que deseja excluir este chamado?</p>
              <button className="botao-excluir" onClick={excluir}>Excluir</button>
              <button onClick={function () { setConfirmando(false); }}>Cancelar</button>
            </div>
          )}

          {chamado.status === "aberto" && (
            <div className="caixa">
              <h3>Próxima etapa: iniciar atendimento</h3>
              <input
                type="text"
                placeholder="Responsável"
                value={responsavel}
                onChange={function (e) { setResponsavel(e.target.value); }}
              />
              <button onClick={iniciar}>Iniciar</button>
            </div>
          )}

          {chamado.status === "em andamento" && (
            <div className="caixa">
              <h3>Próxima etapa: resolver chamado</h3>
              <textarea
                rows="3"
                placeholder="Solução"
                value={solucao}
                onChange={function (e) { setSolucao(e.target.value); }}
              />
              <button onClick={resolver}>Resolver</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PaginaDetalhe;
