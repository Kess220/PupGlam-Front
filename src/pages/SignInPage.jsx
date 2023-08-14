import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/pet.png";
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
        <InputField
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <StyledButton data-test="sign-in-submit" type="submit">
          Login
        </StyledButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>

      <RegisterLink to="/register">
        <h2>Não tem uma conta? Cadastre-se aqui!</h2>
      </RegisterLink>
    </SignInContainer>
  );
}

const InputField = styled.input`
  width: 50%;
  font-size: 16px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  outline: none;

  &:focus {
    border-color: #fca311;
  }
`;
const SignInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1c4698;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  background-color: #b46e3f;
  width: 50%;
  color: #fff;
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

const RegisterLink = styled(Link)`
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  color: white;
  text-decoration: none;
  padding-top: 30px;
  margin-top: 20px;
  border-radius: 10px;
  height: 30px;
  width: 22%;
  display: flex;
  justify-content: space-around;
`;
