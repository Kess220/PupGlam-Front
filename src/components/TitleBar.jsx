import React from "react";
import styled from "styled-components";
import Logo from "/pet.png";

const TitleBar = () => {
  return (
    <Container>
      <SiteLogo src={Logo} alt="Site Logo" />
      <SiteName>Pup Glam</SiteName>
    </Container>
  );
};

const Container = styled.div`
  background-color: #007bff;
  display: flex;
  align-items: center;
  padding: 8px;
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

export default TitleBar;
