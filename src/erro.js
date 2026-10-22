function mensagemDeErro(e) {
  if (!e.response) {
    return "Não foi possível conectar à API.";
  }
  if (e.response.status === 401) {
    return "Chave inválida. Verifique o arquivo .env.";
  }
  if (typeof e.response.data.detail === "string") {
    return e.response.data.detail;
  }
  return "Dados inválidos. Confira os campos.";
}

export default mensagemDeErro;
