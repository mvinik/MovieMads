import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;
const user = localStorage.getItem("User");
function Login() {


  return (
    <Container>
      <div style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute", zIndex: -1, backgroundColor: "rgba(0, 0, 0, 0.6)" }}></div>
      <CTA>
        <CTALogoOne src="/images/mm logo.png" alt="" />
        <SignUp onClick={() =>
          (window.location = `${API_URL}/api/connect/google`)}>LOGIN</SignUp>
        <Description>
          MovieMads: Your gateway to successful film marketing. Showcase your film pre-release with strategic promotion, branding, and social media campaigns. From press releases to targeted audience outreach, MovieMads ensures your film gets the attention it deserves. Join us and design your path to success in the film industry.
        </Description>
      </CTA>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  position: relative;
  height: calc(100vh);
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("/images/loginBG.jpg");
    @media (max-width:756px) {
      background-image: url("/images/miniBg.jpg");
    }
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    
  }
`;
const CTA = styled.div`
  max-width: 650px;
  width: 90%;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
`;

const CTALogoOne = styled.img``;

const SignUp = styled.a`
  cursor: pointer;
  width: 100%;
  background-color: #e50914;
  font-weight: bold;
  padding: 17px 0;
  color: #f9f9f9;
  border-radius: 4px;
  text-align: center;
  font-size: 18px;
  transition: all 250ms;
  letter-spacing: 1.5px;
  margin-top: 8px;
  margin-bottom: 12px;
  &:hover {
    background: #090b13;
  }
  @media(max-width:756px){
    padding 8px 0;
  }
`;

const Description = styled.p`
  letter-spacing: 1.5px;
  font-size: 11px;
  text-align: center;
  line-height: 1.5;
`;

const CTALogoTwo = styled.img`
  width: 90%;
  padding-left: 30px;
`