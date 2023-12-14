import React from "react";
import styled from "styled-components";

const InputField = ({ placeholder, type, value, onChange, dataTest }) => {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      data-test={dataTest}
    />
  );
};

const Input = styled.input`
  width: 50%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
`;

export default InputField;
