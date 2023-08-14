import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/store.png";
import axios from "axios";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState(""); // Mudança: substituído 'password' por 'senha'
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signin`, // Verifique se a URL está correta
        {
          email,
          senha, 
        }
      );

      const { token, userId } = response.data;

      // Armazenar o token e o userId no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", email);

      // Redirecionar o usuário para a rota "/home"
      navigate("/home");
      console.log("Login feito com sucesso!");
      console.log(token);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
        alert(error.response.data.error); // Exibe o erro em um alerta
      } else {
        setError("Erro ao fazer login.");
        alert("Erro ao fazer login."); // Exibe uma mensagem genérica de erro em um alerta
      }
    }
  };

  return (
    <SignInContainer>
      <form onSubmit={handleLogin}>
        <LogoImage src={Logo} alt="Logo" />
        <h1>Shop Now</h1>
        <input
          placeholder="E-mail"
          data-test="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          data-test="senha" // Mudança: substituído 'password' por 'senha'
          type="password"
          autoComplete="new-password"
          value={senha} // Mudança: substituído 'password' por 'senha'
          onChange={(e) => setSenha(e.target.value)} // Mudança: substituído 'password' por 'senha'
        />
        <StyledButton data-test="sign-in-submit" type="submit">
          Login
        </StyledButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>

      <Link to="/register">Não tem uma conta? Cadastre-se aqui!</Link>
    </SignInContainer>
  );
}
const SignInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  background-color: #614e93;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;
