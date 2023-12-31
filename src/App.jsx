import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { createGlobalStyle } from "styled-components";

export default function App() {
  return (
    <BrowserRouter>
      <createGlobalStyle>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:id_cachorro" element={<ProfilePage />} />
        </Routes>
      </createGlobalStyle>
    </BrowserRouter>
  );
}
