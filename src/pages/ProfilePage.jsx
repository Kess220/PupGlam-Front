import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import PostCard from "../components/PostCard";
import AddPostBar from "../components/AddPostBar";
import TitleBar from "../components/TitleBar";
import ReactInputMask from "react-input-mask";

export default function UserProfile() {
  const { id_cachorro } = useParams();
  const [posts, setPosts] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const cachorrosResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/dogs/${id_cachorro}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const selectedCachorro = cachorrosResponse.data.dog;

        setContactInfo(selectedCachorro);

        const postsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/post`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(postsResponse.data.posts);

        const allPosts = postsResponse.data.posts;

        const filteredPosts = allPosts.filter(
          (post) => post.dog_id === Number(id_cachorro)
        );

        setPosts(filteredPosts);
      } catch (error) {
        console.error("Erro ao carregar informações:", error);
      }
    };

    fetchData();
  }, [id_cachorro]);

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\D/g, "");
  }

  return (
    <>
      <TitleBar />
      <HomeContainer>
        <Tutor>
          <h1>Tutor: {contactInfo?.name_tutor}</h1>
        </Tutor>
        <DogDescription>
          {contactInfo && (
            <div>
              <h2>Raça: {contactInfo.breed}</h2>
              <p className="dog-description">{contactInfo.description}</p>
            </div>
          )}
          <Button onClick={openContactModal}>Conquiste meus Talentos</Button>
        </DogDescription>

        <PostContainer>
          <PostScroll>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </PostScroll>
        </PostContainer>
        <AddPostBar />

        {isContactModalOpen && contactInfo && (
          <ContactModal>
            <ContactInfo>
              <ContactTitle>Informações de Contato</ContactTitle>
              <ContactDetails>
                <ContactItem>
                  <ContactLabel>Número de Celular:</ContactLabel>
                  <ContactValue>
                    {contactInfo?.phone && (
                      <ReactInputMask
                        mask=" 99999-9999"
                        value={formatPhoneNumber(contactInfo.phone)}
                        readOnly
                        style={{
                          width: "110px",
                          padding: "8px",
                          fontSize: "16px",
                        }}
                      />
                    )}
                  </ContactValue>
                </ContactItem>
                <ContactItem>
                  <ContactLabel>Email:</ContactLabel>
                  <ContactValue>{contactInfo.email}</ContactValue>
                </ContactItem>
              </ContactDetails>
              <CloseButton onClick={closeContactModal}>Fechar</CloseButton>
            </ContactInfo>
          </ContactModal>
        )}
      </HomeContainer>
    </>
  );
}
const DogDescription = styled.div`
  text-align: center;

  h2 {
    color: #fff;
    margin-bottom: 5px;
    font-size: inherit;
  }

  .dog-description {
    color: #fff;
    font-family: inherit;
    font-size: 16px;
  }
`;

const Tutor = styled.div`
  margin-top: 66px;
  h1 {
    color: #fff;
  }
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
`;

const PostScroll = styled.div`
  overflow: auto;
  max-height: 60vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  overflow: auto;
  position: relative;
  background-color: #1c4698;
`;

const ContactModal = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactInfo = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContactTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
`;

const ContactDetails = styled.div`
  margin-bottom: 20px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ContactLabel = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const ContactValue = styled.span``;

const CloseButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  width: 50%;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;
