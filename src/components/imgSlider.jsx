import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { json, Link } from 'react-router-dom';
import { Overlay } from "antd/es/popconfirm/PurePanel";
import { InfoCircleFilled, InfoCircleOutlined, PlayCircleFilled, PlayCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Token = localStorage.getItem("JwtToken");
const API_URL = process.env.REACT_APP_API_URL;
function ImgSlider() {
 
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows:true,
     centerMode: false, // ✅ Prevent slide preview
  };
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
 
  
const option1 = {
  headers: {
  'Authorization':`Bearer ${Token}`
  },
  };

  const getSlider = async() => {
    try{
      const res = await axios(`${API_URL}/api/sliders?populate[0]=movie.MovieThumbnail&populate[1]=movie.VideoFile`);
      setMovies(res.data.data);
      setLoading(false);

    }catch(err){
      console.error(err);
      window.location.reload();
    }
  }
  useEffect(() => {
    getSlider();
  },[]);

  const skeletonHeight = window.innerWidth > 768 ? '80vh' : '30vh';
  const skeletonWidth = window.innerWidth > 768 ? '300px' : '150px';
  const skeletonWidth2 = window.innerWidth> 768 ? '200px' : '120px';
  

  return (
    <Carousel {...settings}>
      {loading ? (
        <SkeletonTheme baseColor="#212529" highlightColor="rgba(230, 19, 20, 0.05)">
          <Skeleton style={{ width: '95%', margin: '0 2.5%', height: skeletonHeight }} enableAnimation count={1} />
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
            <Skeleton enableAnimation count={1} style={{ height: skeletonWidth, width: skeletonWidth2, flex: '1 1 auto' }} />
            <Skeleton enableAnimation count={1} style={{ height: skeletonWidth, width: skeletonWidth2, flex: '1 1 auto' }} />
            <Skeleton enableAnimation count={1} style={{ height: skeletonWidth, width: skeletonWidth2, flex: '1 1 auto' }} />
            <Skeleton enableAnimation count={1} style={{ height: skeletonWidth, width: skeletonWidth2, flex: '1 1 auto' }} />
            <Skeleton enableAnimation count={1} style={{ height: skeletonWidth, width: skeletonWidth2, flex: '1 1 auto' }} />
            <Skeleton enableAnimation count={1} style={{ height: skeletonWidth, width: skeletonWidth2, flex: '1 1 auto' }} />
          </div>
        </SkeletonTheme>
      ) : (
        movies.map(movie => {
          if (movie.attributes.movie.data) {
            return (
              <Link to={'/details/' + movie.attributes.movie.data.id} onClick={() => window.scrollTo(0, 0)} className="movie-link1">
              <Wrap key={movie.id}>
                <Info>
                  <Subtitle>{movie.attributes.movie.data.attributes.MovieName}</Subtitle>
                    <Button1><PlayCircleFilled spin /> Play Now</Button1>
                    <Button2><InfoCircleFilled /> More Info</Button2>
                  {/* <Description>{movie.attributes.movie.data.attributes.Description}</Description> */}
                </Info>
                <Overlays>
                  <img src={`${API_URL}${movie.attributes.movie.data.attributes.MovieThumbnail.data.attributes.url}`} alt="Img" id={movie.id} />
                </Overlays>
              </Wrap>
                  </Link>
            );
          } else {
            // Handle condition when movie.attributes.movie is not defined
            return null; // or any other fallback
          }
        })
      )}
    </Carousel>
  );
}
export default ImgSlider;
const Carousel = styled(Slider)`

  ul li Button &:before {
    font-size: 10px;
    color: rgb(150, 158, 171);
  }

  .slick-next {
  right: 50px !important; /* move it 20px from the right edge */
}

 .slick-prev {
  left: 30px !important; /* move it 20px from the right edge */
}
  .slick-next:before {
   color: #ff0015;
   font-size: 40px;
   font-weight: bold;
   opacity: 100%;
  }
  .slick-prev:before {
    color: #ff0015;
    font-size: 40px;
    font-weight: bold;
    opacity: 100%;
  }
  @media (max-width: 768px) {
    .slick-next:before{
      display: none;
    }
    .slick-prev:before{
      display: none;
    }
  }
    
  li.slick-active Button1::before {
    color: white;
    display: none;
  }
  .slick-list {
    overflow: hidden;
  }


  Button {
    z-index: 1;
  }
    
`;

const SkeletonWrapper = styled.div`
  margin: 20px;
`;

const Wrap = styled.div`
  position: relative; 
  height:80vh;
&:after {
  content: "";
  position: absolute;
  width: 100%; /* Adjust width as needed */
  height: 45%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0)0%, #000000 100%);
  bottom: 0;
  right: 0;
  pointer-events: none;
  @media (max-width: 768px) {
    height:70%;
  }
  
}

  cursor: pointer;
    @media (max-width: 768px) {
      height: 25vh;
    }
  img {
    // border: 5px solid transparent;
    width:100%;
    height:100%;
    object-fit:cover;
    // border-radius: 10px;
    opacity: 0.8;
    box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
      rgb(0 0 0 / 73%) 0px 16px 10px -10px;
    transition-duration: 300ms;
  }
`;

const Info = styled.div`

position: absolute;
z-index: 3;
bottom: 10px;
left: 0;
padding-left: 50px;
padding-top: 10px;
`;

const Button1 = styled.button`
padding: 10px;
background-color: #ff0015;
color: #ffffff;
border-radius: 5px;
font-size: 15px;
font-weight: bold;
cursor: pointer;
margin-right: 8px;
&:hover{
  background-color: #303030;
}
@media (max-width: 768px) {
  margin: 0px;
  font-size: 10px;
  margin-right: 3px;
padding: 5px;
}
`;
const Button2 = styled.button`
  // margin: 5px;
  padding: 10px;
  background:#fba010;
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  border-radius: 5px;
  cursor: pointer;
  &:hover{
    background-color: #303030;
  }
  @media (max-width: 768px) {
    margin: 0px;
    font-size: 10px;
   
  padding: 5px;
  }
`;

const Subtitle = styled.h1`
  color: #fff;
  font-size: 32px;
  margin-bottom: 10px;
  text-transform: uppercase;
  opacity:0.8;
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 1px;
  }
`;
const Overlays = styled.div`
background: rgba(0, 0, 0, 0.9);
width: 100%;
height: 100%;
`;

const Description = styled.p`
  color: #fff;
  font-size: 18px;
  opacity: 0.8;
  @media (max-width: 768px) {
    font-size: 8px;
    z-index: 10;
  }
`;