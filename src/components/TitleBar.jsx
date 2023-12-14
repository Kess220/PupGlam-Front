import React, { useState } from "react";
import styled from "styled-components";
import { FiPlusCircle } from "react-icons/fi";
import axios from "axios";

import Logo from "/pet.png";

const TitleBar = () => {
  const [showAddDogModal, setShowAddDogModal] = useState(false);

  const handleAddDogClick = () => {
    setShowAddDogModal(true);
  };

  return (
    <Container>
      <SiteLogo src={Logo} alt="Site Logo" />
      <SiteName>Pup Glam</SiteName>
      <AddIcon onClick={handleAddDogClick} />
      {showAddDogModal && (
        <AddDogModal onClose={() => setShowAddDogModal(false)} />
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: rgb(0, 123, 255);
  display: flex;
  align-items: center;
  padding: 8px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const SiteLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

const SiteName = styled.h1`
  font-size: 20px;
  color: #fff;
  margin: 0;
`;

const AddIcon = styled(FiPlusCircle)`
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  margin-left: auto;
  margin-right: 10px;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const AddDogModal = ({ onClose }) => {
  const [dogData, setDogData] = useState({
    nome: "",
    raca: "",
    idade: "",
    descricao: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDogSubmit = async () => {
    // Verificar se algum campo obrigatório está vazio
    const requiredFields = ["nome", "raca", "idade", "descricao"];
    const missingFields = requiredFields.filter((field) => !dogData[field]);

    if (missingFields.length > 0) {
      alert(
        `Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/createdog`,
        {
          name: dogData.nome,
          breed: dogData.raca,
          age: parseInt(dogData.idade),
          description: dogData.descricao,
          hireable: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Novo cachorro cadastrado:", response.data);
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar cachorro:", error);
    }
  };

  return (
    <ModalBackdrop>
      <ModalContent>
        <ModalTitle>Cadastrar Novo Cachorro</ModalTitle>
        <Input
          type="text"
          name="nome"
          placeholder="Nome do cachorro"
          value={dogData.nome}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="raca"
          placeholder="Raça do cachorro"
          value={dogData.raca}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="idade"
          placeholder="Idade do cachorro"
          value={dogData.idade}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="descricao"
          placeholder="Descrição do cachorro"
          value={dogData.descricao}
          onChange={handleInputChange}
        />
        <SubmitButton onClick={handleAddDogSubmit}>Cadastrar</SubmitButton>
        <SubmitButton onClick={onClose}>Cancelar</SubmitButton>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default TitleBar;
