// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Link, useParams } from 'react-router-dom';
// import { InfoCircleFilled, PlayCircleFilled } from "@ant-design/icons";
// import axios from "axios";
// import { message } from 'antd';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Autoplay, Grid, Navigation, Pagination } from 'swiper/modules';

// import { Swiper, SwiperSlide } from 'swiper/react';

// const API_URL = process.env.REACT_APP_API_URL;
// const USERID = localStorage.getItem('UserId');

// function ShortFlimSlider() {
//   const [movies, setMovies] = useState([]);
//   const [price, setPrice] = useState(200);
//   const [hasAccess, setHasAccess] = useState(null)
//   const [accessMap, setAccessMap] = useState({});



//   const token = localStorage.getItem("JwtToken");

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//   };

//   const checkAccess = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/short-film-purchases?filters[user][id][$eq]=${USERID}&populate=short_film`, option1);
//       const accessMap = {};
//       res.data.data.forEach(purchase => {
//         const filmId = purchase.attributes.short_film.data.id;
//         accessMap[filmId] = true;
//       });
//       setAccessMap(accessMap);
//     } catch (err) {
//       console.error("Access check failed:", err);
//     }
//   };

//   useEffect(() => {
//     checkAccess();
//   }, []);

//   const getSlider = async () => {
//     const res = await axios.get(`${API_URL}/api/shortfilm-uploads?populate=*`);
//     console.log("ShortFlim Slider CHECK",res.data)
//     setMovies(res.data.data);
//   }
//   useEffect(() => {
//     getSlider();
//   }, []);



//   // const getAmount = async() =>{
//   //   try{
//   //     const res = await axios.get(`${API_URL}/api/price?populate=*`)
//   //     setPrice(res?.data?.data?.attributes?.ShortFilmPrice);
//   //     console.log(res,'amount')
//   //     console.log('price',price)
//   //   }catch(err){
//   //     console.log(err)
//   //   }
//   // }
//   // useEffect(()=>{
//   //   getAmount();
//   // },[])

//   const option1 = {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     },
//   };

//   const handleShortFilmPayment = async (shortFilm) => {
//     const shortFilmId = shortFilm.id;
//     const price = shortFilm?.attributes?.price;

//     console.log("Sending payment for film:", shortFilmId, "Amount:", price);

//     if (!price) {
//       console.error("Price is missing");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/api/short-films/${shortFilmId}/create-order`,
//         { amount: price },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log("Order created:", response.data);
//       // Proceed with Razorpay checkout...
//     } catch (err) {
//       console.error("Error during short film payment:", err);
//     }
//   };




//   return (
//     <Swiper
//       modules={[Navigation, Pagination, Grid, Autoplay]}
//       slidesPerView={1}
//       centeredSlides={false}
//       spaceBetween={20}
//       autoplay={{
//         delay: 1500,
//         disableOnInteraction: false,
//       }}
//       breakpoints={{
//         // when window width is <= 768px
//         768: {
//           slidesPerView: 3,
//         },
//       }}
//       navigation={true}
//     >
//       {movies.map((movie) => (
//         <SwiperSlide className='swiper-slide1' key={movie.id}>
//           <Wrap >
//             <Info>
//               <Subtitle>{movie?.attributes?.MovieName}</Subtitle>
//               <Link to={'/shortflimDetails/' + movie.id} onClick={() => window.scrollTo(0, 0)} className="movie-link1" >
//                 <Button1><PlayCircleFilled spin /> Play Now</Button1>
//                 {accessMap[movie.id] ? (
//                   <span style={{ color: "lightgreen" }}>Already Purchased</span>
//                 ) : (
//                   <Button2 onClick={() => handleShortFilmPayment(movie?.attributes?.Price)}>
//                     <InfoCircleFilled /> Pay ₹{movie?.attributes?.Price}
//                   </Button2>
//                 )}

//               </Link>
//               {/* <Description>{movie?.attributes?.Description}</Description> */}
//             </Info>
//             <Overlays>
//               <img src={`${API_URL}${movie?.attributes?.MovieThumbnail?.data?.attributes?.formats?.thumbnail?.url}`} alt="Img" id={movie.id} />
//             </Overlays>
//           </Wrap></SwiperSlide>

//       ))}
//     </Swiper>
//     // <Carousel {...settings}>

//     // </Carousel>
//   );
// }

// export default ShortFlimSlider;


// const Carousel = styled(Slider)`
// //   margin-top: 20px;
//   ul li Button &:before {
//     font-size: 10px;
//     color: rgb(150, 158, 171);
//   }
//   .slick-next:before {
//    color: #ff0015;
//    font-size: 40px;
//    font-weight: bold;
//    opacity: 100%;
//   }
//   .slick-prev:before {
//     color: #ff0015;
//     font-size: 40px;
//     font-weight: bold;
//     opacity: 100%;
//   }
//   @media (max-width: 768px) {
//     .slick-next:before{
//       display: none;
//     }
//     .slick-prev:before{
//       display: none;
//     }
//   }
    
//   li.slick-active Button1::before {
//     color: white;
//     display: none;
//   }
//   .slick-list {
//     overflow: visible;
//   }

//   Button {
//     z-index: 1;
//   }
// `;

// const Wrap = styled.div`
//   position: relative; /* To position the Button1s and information */
//   &:after {
//     content: "";
//     position: absolute;
//     width: 100%; /* Adjust width as needed */
//     height: 45%;
//     background: linear-gradient(to bottom, rgba(255, 255, 255, 0)0%, #000000 100%);
//     bottom: 0;
//     right: 0;
//     pointer-events: none;
//     @media (max-width: 768px) {
//       height: 50%;
//     }
// }

//   cursor: pointer;
//   object-fit: cover;
//   object-position: center center;
//     height:30vh;
//     @media (max-width: 768px) {
//       height:25vh;
//     }
//   img {
//     border: 5px solid transparent;
//     opacity: 0.8;
//     width:100%;
//     height:100%;
//     object-fit: cover;
//     border-radius: 10px;
//     box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
//       rgb(0 0 0 / 73%) 0px 16px 10px -10px;
//     transition-duration: 300ms;
//     // &:hover {
//     //   border: 4px solid rgba(249, 249, 249, 0.8);
//     // }

//   }
// `;
// const Overlay1 = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
//   z-index: 2;
// `;

// const Info = styled.div`
// position: absolute;
// z-index: 3;
// bottom: 0;
// margin-bottom: 10px;
// margin-left: 20px;
// @media (max-width: 768px) {
//   // display: none;
// }
// `;

// const Button1 = styled.button`
// padding: 10px;
// background-color: #ff0015;
// color: #ffffff;
// border-radius: 5px;
// font-size: 15px;
// font-weight: bold;
// cursor: pointer;
// @media (max-width: 768px) {
//   margin: 0px;
//   font-size: 10px;
//   margin-right: 3px;
// padding: 5px;
// }
// `;
// const Button2 = styled.button`
// // margin: 5px;
// padding: 10px;
// background-color: #303030;
// background:#fba010;
// color: #fff;
// font-weight: bold;
// font-size: 15px;
// border-radius: 5px;
// cursor: pointer;
// @media (max-width: 768px) {
//   margin: 0px;
//   font-size: 10px;
// padding: 5px;
// }
// `;

// const Subtitle = styled.h2`
//   color: #fff;
//   font-size: 32px;
//   margin-bottom: 10px;
//   text-transform: uppercase;
//   opacity:0.8;
//   @media (max-width: 768px) {
//     font-size: 20px;
//     margin-bottom: 1px;
//   }
// `;
// const Overlays = styled.div`
// background: rgba(0, 0, 0, 0.9);
// width: 100%;
// height: 100%;
// `;

// const Description = styled.p`
//   color: #fff;
//   font-size: 18px;
//   @media (max-width: 768px) {
//     font-size: 10px;
//   }
// `;


import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import {Link } from 'react-router-dom';
import './Slider11.css';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Grid, Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const Token = localStorage.getItem("JwtToken");
const MovieReviews = () => {
  const [movies, setMovies] = useState([]);
  const [seoData, setSeoData] = useState(null);
  const navigate = useNavigate();
  
const option1 = {
  headers: {
  'Authorization':`Bearer ${Token}`
  },
  };
  const getMovies = async() => {
    try{
      const res = await axios.get(`${API_URL}/api/shortfilm-uploads?populate=*`);
      setMovies(res.data.data);
    }catch(err){
      console.error(err);
    }
  }
  useEffect(() => {
    getMovies();
  },[]);


      return (
          <Container>
              <div style={{display:'flex', justifyContent:"space-between"}}>
              <h1 onClick={() => { navigate("/shortfilmupload"); }}>SHORT FILMS <span>&#8702;</span></h1>
              {/* <h3 >View More</h3> */}
              </div>
              <Swiper
        modules={[ Navigation, Pagination,Grid,Autoplay]}
        slidesPerView={1}
        centeredSlides={false}
        spaceBetween={20}
        autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            // when window width is <= 768px
            768: {
              slidesPerView: 3,
            },
          }}
        navigation={true}
      >
                {movies.map((movie) => (
                        <SwiperSlide className='swiper-slide1' key={movie.id}>
                            <Link to={'/shortflimDetails/' + movie.id} onClick={() => window.scrollTo(0, 0)} className="movie-link1" >
                            <div className="movie-container1">
                            <img src={`${API_URL}${movie.attributes.MovieThumbnail.data.attributes.url}`} alt="Img" id={movie.id}/>
                            <div className="overlay1">
                                <p className="movie-name1">{movie.attributes.MovieName}</p>
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

export default MovieReviews;

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
  grid-template-columns: repeat(5, minmax(0, 1fr));

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