import React, { useState } from "react";
import Swal from "sweetalert2";
import usuarioService from "../../services/usuario-service";
import "./index.css"; // Estilos CSS para o componente

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const autenticar = () => {
    if (!email || !senha) {
      Swal.fire({
        icon: "error",
        text: "Por favor, preencha todos os campos.",
      });
      return;
    }

    usuarioService
      .autenticar(email, senha)
      .then((response) => {
        usuarioService.salvarToken(response.data.token);
        usuarioService.salvarUsuario(response.data.usuario);
        window.location = "/";
      })
      .catch((erro) => {
        Swal.fire({
          icon: "error",
          text: "Falha ao autenticar. Por favor, verifique suas credenciais.",
        });
      });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-header">Faça Login</h2>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Digite seu e-mail"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <div className="senha-input">
            <input
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              required
            />
      
          </div>
        </div>
        <div className="form-group">
          <button className="btn-login" onClick={autenticar}>Entrar</button>
        </div>
        <div className="forgot-password">
          <a style={{color:"white"}}href="#">Esqueceu sua senha?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
