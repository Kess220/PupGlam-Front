import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import Logo from "/pet.png";
import InputMask from "react-input-mask";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const sanitizedCpf = cpf.replace(/\D/g, "");
  const sanitizedTelefone = telefone.replace(/\D/g, "");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleCpfChange = (event) => {
    setCpf(event.target.value);
  };

  const handleTelefoneChange = (event) => {
    setTelefone(event.target.value);
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
        nome: name,
        email,
        senha: password,
        confirmarSenha: confirmPassword,
        cpf: sanitizedCpf, // Envia o CPF sem a formatação da máscara
        telefone: sanitizedTelefone, // Envia o telefone sem a formatação da máscara
      });

      // Redirecionar o usuário para a página de login
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Este email já está sendo utilizado.");
      } else {
        console.error("Erro ao cadastrar usuário:", error);
        console.log(`${import.meta.env.VITE_API_URL}`);
        alert(
          "Erro ao cadastrar usuário. Verifique os campos e tente novamente."
        );
      }
    }
  };

  return (
    <SignUpContainer>
      <LogoImage src={Logo} alt="Logo" />
      <form onSubmit={handleSignUpSubmit}>
        <Input
          placeholder="Nome"
          data-test="name"
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <Input
          placeholder="E-mail"
          type="email"
          data-test="email"
          value={email}
          onChange={handleEmailChange}
        />
        <Input
          placeholder="Senha"
          data-test="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Input
          placeholder="Confirme a senha"
          data-test="conf-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <InputMask
          style={{
            width: "50%",
            padding: "10px",
            marginBottom: "10px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
          }}
          placeholder="CPF"
          mask="999.999.999-99"
          data-test="cpf"
          value={cpf}
          onChange={handleCpfChange}
        />
        <InputMask
          style={{
            width: "50%",
            padding: "10px",
            marginBottom: "10px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
          }}
          placeholder="Telefone"
          mask="(99) 99999-9999"
          data-test="telefone"
          value={telefone}
          onChange={handleTelefoneChange}
        />
        <StyledButton data-test="sign-up-submit" type="submit">
          Cadastrar
        </StyledButton>
      </form>

      <Link to="/">Já tem uma conta? Entre agora!</Link>
    </SignUpContainer>
  );
}

const Input = styled.input`
  width: 50%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
`;

const SignUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1c4698;
`;

const StyledButton = styled.button`
  background-color: #b46e3f;
  width: 30%;
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
`;
