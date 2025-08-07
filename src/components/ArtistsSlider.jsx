import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Pagination, Grid, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Slider.css';
import { Link } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;
// const Token = localStorage.getItem("JwtToken");

const endpoints = [
    'singers',
    'dancers',
    'models',
    'musicians',
    'agent-models',
    'agent-musicians',
    'agent-singers',
    'agent-dancers'
];

const routeMap = {
    'agent-models': 'agent-model',
    'agent-singers': 'agent-singer',
    'agent-dancers': 'agent-dancer',
    'agent-musicians': 'agent-musician',
    'models': 'model',
    'singers': 'singer',
    'dancers': 'dancer',
    'musicians': 'musician',
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const ArtistsSlider = () => {
    const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
    const fetchPosters = async () => {
        try {
            // const option1 = {
            //     headers: {
            //         Authorization: `Bearer ${Token}`,
            //     },
            // };

            const requests = endpoints.map((endpoint) =>
                axios.get(`${API_URL}/api/${endpoint}?filters[Payment][$eq]=Paid&populate[Poster]=*`
                    // , option1
                )
            );

            const responses = await Promise.all(requests);

            const allartists = responses.flatMap((res, i) => {
                const type = endpoints[i];
                return res.data.data.map((item) => {
                    const posterUrl = item.attributes?.Poster?.data?.attributes?.url;
                    const name = item.attributes?.Name;
                    const id = item.id;
                    if (posterUrl && name && id) {
                        return {
                            name,
                            poster: `${API_URL}${posterUrl}`,
                            type,
                            id,
                        };
                    }
                    return null;
                }).filter(Boolean); // remove nulls
            });

            setArtists(shuffleArray(allartists));


        } catch (error) {
            console.error('Error fetching posters:', error);
        }
    };

    useEffect(() => {
        fetchPosters();
    }, []);



    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <h1 onClick={() => { navigate("/model"); }}>ARTISTS<span>&#8702;</span></h1>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Grid, Autoplay]}
                slidesPerView={2}
                centeredSlides={false}
                spaceBetween={20}
                navigation={true}
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 6,
                    },
                    486:{
                        slidesPerView:2,
                    }
                }}
                className="mySwiper"
            >
                {artists.map((artist, index) => {
                    const route = routeMap[artist.type] || 'profile';
                    const linkPath = `/${route}/${artist.id}`;

                    return (
                        <SwiperSlide key={index}>
                            <Link to={linkPath} onClick={() => window.scrollTo(0, 0)} className="movie-link">
                                <div className="movie-container">
                                    <img
                                        src={artist.poster}
                                        alt="artist Poster"
                                        style={{
                                            width: '100%',
                                            height: '280px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <div className="overlay">
                                        <p className="movie-name">{artist.name}</p>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}

            </Swiper>
        </Container>
    );
};

export default ArtistsSlider;

const Container = styled.div`
  h1 {
    padding: 10px 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    span {
      opacity: 0;
      font-size: 1.5rem;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
      display: inline-block;
      transform: translateX(-25px);
    }
    &:hover {
      color: #e50914;
      span {
        opacity: 1;
        transform: translateX(5px);
      }
    }
  }
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
