import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/pet.png";
import InputField from "../components/InputField";
import MaskedInputField from "../components/MaskedInputField";
import Swal from "sweetalert2";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    telefone: "",
  });

  const handleInputChange = (fieldName) => (event) => {
    setFormData({ ...formData, [fieldName]: event.target.value });
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword, cpf, telefone } = formData;

    if (!name || !email || !password || !confirmPassword || !cpf || !telefone) {
      Swal.fire({
        icon: "question",
        title: "Oops...",
        text: "Todos os campos devem ser preenchidos.",
        customClass: {
          popup: "custom-popup-class",
          icon: "custom-icon-class",
        },
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas não coincidem.",
        customClass: {
          popup: "custom-popup-class",
          icon: "custom-icon-class",
        },
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
        name,
        email,
        password,
        confirmPassword,
        cpf: cpf.replace(/\D/g, ""),
        phone: telefone.replace(/\D/g, ""),
      });

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "E-mail já está sendo utilizado",
          customClass: {
            popup: "custom-popup-class",
            icon: "custom-icon-class",
          },
        });
      } else {
        console.error("Erro ao cadastrar usuário:", error);
        console.log(`${import.meta.env.VITE_API_URL}`);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao cadastrar o usuário, verifique os campos e tente novamente!",
          customClass: {
            popup: "custom-popup-class",
            icon: "custom-icon-class",
          },
        });
      }
    }
  };

  return (
    <SignUpContainer>
      <LogoImage src={Logo} alt="Logo" />
      <form onSubmit={handleSignUpSubmit}>
        <InputField
          placeholder="Nome"
          type="text"
          value={formData.name}
          onChange={handleInputChange("name")}
          dataTest="name"
        />
        <InputField
          placeholder="E-mail"
          type="email"
          value={formData.email}
          onChange={handleInputChange("email")}
          dataTest="email"
        />
        <InputField
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleInputChange("password")}
          dataTest="password"
        />
        <InputField
          placeholder="Confirme a senha"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleInputChange("confirmPassword")}
          dataTest="conf-password"
        />
        <MaskedInputField
          placeholder="CPF"
          mask="999.999.999-99"
          value={formData.cpf}
          onChange={handleInputChange("cpf")}
          dataTest="cpf"
        />
        <MaskedInputField
          placeholder="Telefone"
          mask="(99) 99999-9999"
          value={formData.telefone}
          onChange={handleInputChange("telefone")}
          dataTest="telefone"
        />
        <StyledButton data-test="sign-up-submit" type="submit">
          Cadastrar
        </StyledButton>
      </form>

      <Link to="/">Já tem uma conta? Entre agora!</Link>
    </SignUpContainer>
  );
}

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
