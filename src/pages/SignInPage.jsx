import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/pet.png";
import axios from "axios";
import Swal from "sweetalert2";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signin`,
        {
          email,
          password,
        }
      );

      const { token, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", email);

      navigate("/home");

      showSuccessMessage();

      console.log("Login successful!");
      console.log(token);
    } catch (error) {
      if (error?.response && error?.response.data) {
        setError(error.response.data.error);
        if (error.response.status === 401) {
          showAlert(
            "error",
            "Credenciais incorretas. Verifique seu e-mail e senha."
          );
        } else {
          showAlert("error", error.response.data.error);
        }
      } else {
        setError("Error logging in.");
        showAlert("error", "Error logging in.");
      }
    }
  };

  const showSuccessMessage = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Login feito com sucesso",
      showConfirmButton: false,
      width: "80%",
      size: "20px",
      timer: 1500,
      customClass: {
        popup: "custom-popup-class",
        icon: "custom-icon-class",
      },
    });
  };

  const showAlert = (icon, text) => {
    Swal.fire({
      icon: icon,
      title: "Oops...",
      text: text,
      width: "80%",
      customClass: {
        popup: "custom-popup-class",
        icon: "custom-icon-class",
      },
    });
  };

  return (
    <SignInContainer>
      <form onSubmit={handleLogin}>
        <LogoImage src={Logo} alt="Logo" />
        <h1>Pup Glam</h1>
        <InputField
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <StyledButton data-test="sign-in-submit" type="submit">
          Login
        </StyledButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>

      <RegisterLink to="/register">
        <h2>Cadastre-se aqui!</h2>
      </RegisterLink>
    </SignInContainer>
  );
}

const CustomContent = styled.div`
  font-size: 16px; // Tamanho de fonte padrão

  @media (max-width: 768px) {
    font-size: 14px; // Tamanho de fonte menor para dispositivos móveis

    .swal2-popup {
      width: 80%; // Ajuste a largura da janela para 80% em dispositivos móveis
    }
  }
`;

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

  @media (max-width: 768px) {
    width: 80%;
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

  @media (max-width: 768px) {
    width: 80%;
  }
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
  width: 80%;
  display: flex;
  justify-content: space-around;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
