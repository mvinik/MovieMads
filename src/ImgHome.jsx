import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './components/Slider.css';
// import required modules
import { EffectCoverflow, Grid, Navigation, Pagination, Scrollbar, Virtual } from 'swiper/modules';
import axios from 'axios';
const Token = localStorage.getItem("JwtToken");
// console.log(Token,'token')
const API_URL = process.env.REACT_APP_API_URL;
const ImgHome = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const option1 = {
    headers: {
      'Authorization': `Bearer ${Token}`
    },
  };

  const getMovies = async () => {
    try {
      const res =await axios(`${API_URL}/api/sliders?populate[0]=movie.MovieThumbnail&populate[1]=movie.VideoFile`);
      setMovies(res.data.data);
     
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getMovies();
  }, []);
  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <h1 onClick={() => { navigate("/movieTrailer"); }}>LATEST MOVIE TRAILERS<span>&#8702;</span></h1>
        {/* <h3 >View More</h3> */}
      </div>
      <Swiper
        modules={[Navigation, Pagination, Grid]}
        slidesPerView={2}
        centeredSlides={false}
        spaceBetween={20}
        navigation={true}
        breakpoints={{
          // when window width is <= 768px
          768: {
            slidesPerView: 6,
          },
        }}
        className="mySwiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link to={'/details/' + movie.attributes.movie.data.id} onClick={() => window.scrollTo(0, 0)} className="movie-link" >
              <div className="movie-container">
                 <img src={`${API_URL}${movie.attributes.movie.data.attributes.MovieThumbnail.data.attributes.url}`} alt="Img" id={movie.id} />
                <div className="overlay">
                  <p className="movie-name">{movie.attributes.movie.data.attributes.MovieName}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))
        }
      </Swiper>
    </Container>
  )
}

export default ImgHome;

const Container = styled.div`
h1{
  padding: 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  span{
    opacity:0;
    font-size:1.5rem;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    display: inline-block;
    transform: translateX(-25px);
  }
  &:hover{
    color:#e50914;
    span{
        opacity:1;
    transform: translateX(5px);
      }
  }
}
  @media(max-width:768px){
    font-size:16px;
  }
}`;


const Content = styled.div`
cursor: pointer;
height: 90%;
width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    height: 100%;
  }
`;

const Wrap = styled.div`
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid rgba(249, 249, 249, 0.1);
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    transform: scale(1.05);
    box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
      rgb(0 0 0 / 73%) 0px 16px 10px -10px;
    border-color: rgba(249, 249, 249, 0.8);
  }
`;