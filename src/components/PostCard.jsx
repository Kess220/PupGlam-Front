import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaHeart, FaComment } from "react-icons/fa";
import { IoMdPaw } from "react-icons/io";

const PostCard = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [usuariosQueCurtiram, setUsuariosQueCurtiram] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/postagem/${post.id}/comentarios`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Erro ao obter os comentários:", error);
      }
    };

    const fetchLikesCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/postagem/${post.id}/curtidas`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikesCount(response.data.likesCount);
        setUsuariosQueCurtiram(response.data.usuariosQueCurtiram);
      } catch (error) {
        console.error("Erro ao obter o número de curtidas:", error);
      }
    };

    fetchComments();
    fetchLikesCount();
  }, [post.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (newComment.trim() === "") {
      // Se o comentário estiver vazio ou apenas contiver espaços em branco, exiba um alerta.
      alert("Por favor, insira um comentário antes de enviar.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/postagem/${post.id}/comentar`,
        {
          texto: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setComments([...comments, response.data.comentario]);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/postagem/${post.id}/curtir`;
      const unlikingUrl = `${import.meta.env.VITE_API_URL}/postagem/${
        post.id
      }/descurtir`;

      if (usuariosQueCurtiram.includes(localStorage.getItem("userId"))) {
        // Descurtir usando o método DELETE
        await axios.delete(unlikingUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        try {
          await axios.post(
            url,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          if (error.response && error.response.status === 400) {
            await axios.delete(unlikingUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } else {
            console.error("Erro ao curtir postagem:", error);
          }
        }
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/postagem/${post.id}/curtidas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error("Erro ao curtir/descurtir postagem:", error);
    }
  };
  const handlePawIconClick = () => {
    if (post.cachorro_disponivel_contratacao) {
      window.location.href = `/profile/${post.id_cachorro}`;
    } else {
      alert(
        "O cachorro está de férias e não está disponível para contratação no momento."
      );
    }
  };

  const MAX_VISIBLE_COMMENTS = 3;
  const visibleComments = showAllComments
    ? comments
    : comments.slice(0, MAX_VISIBLE_COMMENTS);

  return (
    <Card>
      <DogInfo>
        <DogName>{post.nome_cachorro}</DogName>
        <DogAge>{post.idade_cachorro} anos</DogAge>
      </DogInfo>
      <ImageContainer>
        <PostImage src={post.imagem_url} alt="Post" />
      </ImageContainer>
      <Interactions>
        <Icon onClick={handleToggleLike}>
          <FaHeart />
          <Likes>{likesCount}</Likes>
        </Icon>
        <Icon>
          <FaComment />
          <Comments>{comments.length}</Comments>
        </Icon>
        <Icon>
          <IoMdPaw
            color={post.cachorro_disponivel_contratacao ? "green" : "red"}
            onClick={handlePawIconClick}
          />
        </Icon>
      </Interactions>
      <Description>{post.descricao}</Description>
      <Divider />
      <CommentsSection>
        <h3>Comentários</h3>
        {visibleComments.map((comment) => (
          <Comment key={comment.id}>{comment.texto}</Comment>
        ))}
        {comments.length > MAX_VISIBLE_COMMENTS && (
          <ViewCommentsButton
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? "Ver Menos Comentários" : "Ver Mais Comentários"}
          </ViewCommentsButton>
        )}
        <CommentForm onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Comentar</button>
        </CommentForm>
      </CommentsSection>
    </Card>
  );
};

const Divider = styled.hr`
  margin: 12px 0;
  border: 0;
  border-top: 1px solid #4e4d4d53;
`;

const Card = styled.div`
  width: 300px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 10px;
  margin: 16px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const ImageContainer = styled.div`
  overflow: hidden;
  width: 100%;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
`;

const Interactions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  svg {
    margin-right: 4px;
  }
`;

const Likes = styled.span`
  margin-left: 4px;
`;

const Comments = styled.span`
  margin-left: 4px;
`;

const Description = styled.p`
  padding: 12px;
  font-size: 23px;
`;

const DogInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
`;

const DogName = styled.span`
  font-weight: bold;
`;

const DogAge = styled.span`
  margin-left: 8px;
  color: #999;
`;

const CommentsSection = styled.div`
  padding: 12px;
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
  }
`;

const Comment = styled.div`
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  textarea {
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    resize: vertical;
    margin-bottom: 8px;
    width: 100%;
  }
  button {
    align-self: flex-end;
    padding: 8px 16px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const ViewCommentsButton = styled.button`
  background-color: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  margin-top: 8px;
  width: 92%;
`;

export default PostCard;
