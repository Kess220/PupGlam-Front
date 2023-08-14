import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import PostCard from "../components/PostCard";
import AddPostBar from "../components/AddPostBar";
import TitleBar from "../components/TitleBar";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/postagem`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(response.data.posts);
        console.log("Posts received from API:", response.data.posts);
      } catch (error) {
        console.error("Erro ao obter as postagens:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <HomeContainer>
        <TitleBar></TitleBar>

        <Feed>
          {posts
            .slice()
            .reverse()
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </Feed>
      </HomeContainer>
      <AddPostBar />
    </>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #1c4698;
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 54px;
`;
