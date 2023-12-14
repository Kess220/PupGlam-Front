import React from "react";
import styled from "styled-components";
import InputField from "./InputField";
import MaskedInputField from "./MaskedInputField";

const SignUpForm = ({
  onSubmit,
  name,
  email,
  password,
  confirmPassword,
  cpf,
  telefone,
  handleInputChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <InputField
        placeholder="Nome"
        type="text"
        value={name}
        onChange={handleInputChange("name")}
        dataTest="name"
      />
      <InputField
        placeholder="E-mail"
        type="email"
        value={email}
        onChange={handleInputChange("email")}
        dataTest="email"
      />
      <InputField
        placeholder="Senha"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={handleInputChange("password")}
        dataTest="password"
      />
      <InputField
        placeholder="Confirme a senha"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={handleInputChange("confirmPassword")}
        dataTest="conf-password"
      />
      <MaskedInputField
        placeholder="CPF"
        mask="999.999.999-99"
        value={cpf}
        onChange={handleInputChange("cpf")}
        dataTest="cpf"
      />
      <MaskedInputField
        placeholder="Telefone"
        mask="(99) 99999-9999"
        value={telefone}
        onChange={handleInputChange("telefone")}
        dataTest="telefone"
      />
    </form>
  );
};

export default SignUpForm;
