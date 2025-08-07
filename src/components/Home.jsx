import styled from "styled-components";
import React, { useEffect } from "react";
import Viewers from "./Viewers";
import Movies from "./Movies";
import ImgSlider from "./imgSlider";
import Footer from "./Footer/Footer";
import UpcomingMovies from "./upcomingMovies";
import Topnav from "./TopNav/Topnav";
import EventPartners from "./EventPartners/EventPartners";
import { useNavigate } from "react-router-dom";
import MovieReviews from "./MovieReviews";
import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "./Header";
import VideoModal from "./VideoModal";
import ShortFlimSlider from './ShortFilms/ShortFlimSlider'
import ArtistsSlider from "./ArtistsSlider";
import ImgHome from "../ImgHome";

function Home() {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Set a timeout to show the modal after 2 seconds
    const timer = setTimeout(() => {
      setShowModal(true);
    },3000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);




  return (
    <>
    <Topnav/>
    <Header/>
      <ImgSlider />{/* slider in home */}
      <Container>
      
        {/* <ImgHome/> */}
        <UpcomingMovies />
        <Movies />
        <ArtistsSlider/>
      {/* <h1>SHORT FILM AWARDS 2024 <span>&#8702;</span> </h1>
        <Viewers /> */}
       {/* <h1>SHORT FILMS <span>&#8702;</span> </h1> */}
       {/* <ShortFlimSlider/>  */}
        <MovieReviews />
        <EventPartners />
      </Container>
        <Footer />
        {/* <VideoModal showModal={showModal} handleClose={handleCloseModal} /> */}
    </>
  );
}

export default Home;

const Container = styled.main`
  min-height: calc(100vh - 70px);
  padding: 0 calc(3.5vw + 5px);
  position: relative;
  padding-bottom: 50px;
  overflow-x: hidden;
  &:before {
    // background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  h1{

  }
`;
