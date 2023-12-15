import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiUser, FiLogOut, FiHome } from "react-icons/fi";
import { IoMdPaw } from "react-icons/io";
import styled from "styled-components";
import axios from "axios";
import PropTypes from "prop-types";

const AddPostBar = ({ fetchAndSetData }) => {
  const navigate = useNavigate();
  const [isDogModalOpen, setIsDogModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [postDescription, setPostDescription] = useState("");
  const [postImageURL, setPostImageURL] = useState("");
  const [selectedDogId, setSelectedDogId] = useState("");

  const [userDogs, setUserDogs] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);

  const fetchUserDogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/alldogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDogs(response.data.dogs);
    } catch (error) {
      console.error("Error loading user dogs:", error);
    }
  };
  useEffect(() => {
    fetchUserDogs();
  }, []);

  const handleAddClick = () => {
    setIsAdding(!isAdding);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      console.log("Dados a serem enviados:", {
        image_url: postImageURL,
        description: postDescription,
        dog_id: selectedDogId,
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post`,
        {
          image_url: postImageURL,
          description: postDescription,
          dog_id: selectedDogId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Nova postagem adicionada:", response.data);

      setIsAdding(false);
      setPostDescription("");
      setPostImageURL("");
      setSelectedDogId("");
    } catch (error) {
      console.error("Erro ao adicionar postagem:", error);
    }
  };

  const handleDogStatusToggle = async (dogId, newStatus) => {
    try {
      if (selectedDogId !== "") {
        const token = localStorage.getItem("token");

        // Fazer uma requisição para obter as informações do cachorro
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dogs/${selectedDogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const selectedDog = response.data.dog;

        if (selectedDog) {
          const newStatus = !selectedDog.hireable;

          const requestBody = {
            newStatus: newStatus,
          };

          await axios.put(
            `${import.meta.env.VITE_API_URL}/dogs/${selectedDogId}/hiring`,
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          fetchUserDogs();
          fetchAndSetData();

          handleCloseDogModal();
        }
      }
    } catch (error) {
      console.error("Error updating dog status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDogIconClick = () => {
    setIsDogModalOpen(true);
    setSelectedDog(selectedDog);
  };

  const handleCloseDogModal = () => {
    setIsDogModalOpen(false);
    setSelectedDogId(null);
  };

  return (
    <BarContainer>
      <IconContainer>
        <AddIcon onClick={handleAddClick} color="#fff" />
        <UserIcon onClick={() => setShowProfileModal(true)} color="#fff" />
        <HomeIcon onClick={() => navigate("/home")} title="Home">
          <FiHome size={32} color="#fff" />
        </HomeIcon>
        <LogoutIcon onClick={handleLogout} color="#fff" />
        <IoMdPaw onClick={handleDogIconClick} size={37} color="#fff" />
      </IconContainer>
      {isAdding && (
        <Backdrop>
          <AddPostForm>
            <FormTitle>New Post Details:</FormTitle>
            <Input
              type="text"
              placeholder="Post Description"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Image URL"
              value={postImageURL}
              onChange={(e) => setPostImageURL(e.target.value)}
            />
            <SelectDog
              value={selectedDogId}
              onChange={(e) => setSelectedDogId(e.target.value)}
            >
              <option value="">Select Dog</option>
              {userDogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </SelectDog>
            <ButtonContainer>
              <SubmitButton onClick={handlePostSubmit}>Add Post</SubmitButton>
              <CancelButton onClick={() => setIsAdding(false)}>
                Cancel
              </CancelButton>
            </ButtonContainer>
          </AddPostForm>
        </Backdrop>
      )}
      {showProfileModal && (
        <Backdrop>
          <ProfileModal dog={selectedDog}>
            <ProfileTitle>{userDogs[0].name_tutor}</ProfileTitle>
            <ProfileName>
              {userDogs.length > 0
                ? userDogs[0].owner_name
                : "Register a dog first"}
            </ProfileName>
            <DogList>
              {userDogs.map((dog) => (
                <DogItem key={dog.id}>{dog.name}</DogItem>
              ))}
            </DogList>
            <CloseButton onClick={() => setShowProfileModal(false)}>
              Close
            </CloseButton>
          </ProfileModal>
        </Backdrop>
      )}
      {isDogModalOpen && (
        <Backdrop>
          <DogModal>
            <ModalTitle>Dog Status</ModalTitle>
            <SelectDog
              value={selectedDogId}
              onChange={(e) => setSelectedDogId(e.target.value)}
            >
              <option value="">Select Dog</option>
              {userDogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </SelectDog>
            <DogStatusButton
              onClick={() => {
                if (selectedDogId !== "") {
                  handleDogStatusToggle(
                    selectedDogId,
                    !userDogs.find((dog) => dog.id === selectedDogId)?.hireable
                  );
                }
              }}
              disabled={selectedDogId === ""}
            >
              {userDogs.find((dog) => dog.id === selectedDogId)?.hireable
                ? "Deactivate"
                : "Activate"}
            </DogStatusButton>
            <CancelButton onClick={handleCloseDogModal}>Cancel</CancelButton>
          </DogModal>
        </Backdrop>
      )}
    </BarContainer>
  );
};

const HomeIcon = styled.div`
  font-size: 36px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const DogModal = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const DogList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const DogItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
`;

const DogName = styled.span`
  flex-grow: 1;
`;

const DogStatus = styled.span`
  font-weight: bold;
  color: ${(props) => (props.active ? "#00cc00" : "#ff0000")};
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
`;

const ModalActionButton = styled.button`
  background-color: ${(props) => (props.active ? "#00cc00" : "#ff0000")};
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 48%;

  &:hover {
    background-color: ${(props) => (props.active ? "#008800" : "#cc0000")};
    transform: scale(1.05);
  }
`;
const DogStatusButton = styled.button`
  background-color: #1c4698;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 75%;
  margin-bottom: 10px;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileModal = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
`;
const ProfileName = styled.p`
  font-size: 16px;
  margin-bottom: 8px;
`;
const CachorroList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const CloseButton = styled.button`
  background-color: #ccc;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #999;
    transform: scale(1.05);
  }
`;
const CachorroItem = styled.li`
  font-size: 14px;
  margin-bottom: 8px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 16px;
`;
const LogoutIcon = styled(FiLogOut)`
  font-size: 36px;
  color: #ff5722;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserIcon = styled(FiUser)`
  font-size: 36px;
  color: #007bff;
  cursor: pointer;
  margin-left: 16px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;
const SelectDog = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;
`;

const BarContainer = styled.div`
  position: fixed;
  background: #007bff;
  width: 100%;
  height: 40px;
  bottom: 0px;
  display: flex;
  -webkit-box-pack: end;
  -webkit-box-align: center;
  align-items: center;
  padding: 8px;
  justify-content: space-around;
`;

const AddIcon = styled(FiPlusCircle)`
  font-size: 36px;

  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Backdrop = styled.div`
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

const AddPostForm = styled.form`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-right: 21px;
  width: 75%;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  width: 75%;

  &:hover {
    background-color: #999;
    transform: scale(1.05);
  }
`;

export default AddPostBar;

AddPostBar.propTypes = {
  fetchAndSetData: PropTypes.func.isRequired,
};
