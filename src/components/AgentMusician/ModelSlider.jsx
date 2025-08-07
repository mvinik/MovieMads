import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { FormOutlined } from "@ant-design/icons";
import './Model.css'
import axios from "axios";
import { message } from "antd";

const Token = localStorage.getItem("JwtToken");
const USERID = localStorage.getItem('UserId');
const API_URL = process.env.REACT_APP_API_URL;

const ModelSlider = () => {
    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    const [movies, setMovies] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("JwtToken"));
    const [modelExists, setModelExists] = useState(null);
    const [agentExists, setAgentExists] = useState(false);
    const [dancerExists, setDancerExists] = useState(false);
    const [singerExists, setSingerExists] = useState(false);
    const [musicianExists, setMusicianExists] = useState(false);
    const navigate = useNavigate();

    const option1 = {
        headers: {
            'Authorization': `Bearer ${Token}`
        },
    };

    const getSlider = async() => {
        try {
            const res = await axios.get(`${API_URL}/api/slider-for-movie-trailers?populate[0]=movieTrailer.MovieThumbnail&populate[1]=movieTrailer.VideoFile`, option1);
            setMovies(res?.data?.data);
        } catch(err) {
            console.error(err);
        }
    }

    const checkExistingApplications = async() => {
        const res = await axios.get(`${API_URL}/api/users/${USERID}?populate=model&populate=role&populate=agent_models&populate=dancer&populate=singer&populate=musician`);
        setModelExists(res?.data?.model);
        setAgentExists(res?.data?.agent_models?.length > 0);
        setDancerExists(res?.data?.dancer !== null);
        setSingerExists(res?.data?.singer !== null);
        setMusicianExists(res?.data?.musician !== null);
    }

    useEffect(() => {
        getSlider();
        if(localStorage.getItem('redirect')) {
            localStorage.removeItem('redirect');
        }
        if(USERID) checkExistingApplications();
    }, [token]);

    const applyNow = async (type) => {
  if (!token) {
    localStorage.setItem("redirect", window.location.pathname);
    navigate("/login");
    return;
  }

  // Special case: If user is an Agent, only allow Agent Model applications
  if (agentExists) {
    if (type === 'Agent') {
      navigate("/agentModelForm");
    } else {
      message.error('As an Agent, you can only register Agent Models');
    }
    return;
  }

  // For non-agents, check if they already have any other application
  const hasOtherApplication = modelExists || dancerExists || singerExists || musicianExists;
  
  if (hasOtherApplication) {
    message.error('You can only register for one category');
    return;
  }

  // Navigate to the appropriate form
  switch(type) {
    case 'Agent':
      navigate("/agentModelForm");
      break;
    case 'Dancer':
      navigate("/dancerForm");
      break;
    case 'Singer':
      navigate("/singerForm");
      break;
    case 'Musician':
      navigate("/musicianForm");
      break;
    case 'Model':
    default:
      navigate("/modelForm");
      break;
  }
};

    return (
        <Carousel {...settings}>
            <Wrap>
                <Info>
                    <Subtitle>Want to be an artist?<br/>Choose your category</Subtitle>
             <ButtonContainer>
    <FirstRow>
        <Button1 onClick={() => applyNow('Model')}>
            <FormOutlined /> Apply As Model
        </Button1>
        <Button2 onClick={() => applyNow('Agent')}>
            <FormOutlined /> Apply As Agent
        </Button2>
        <Button3 onClick={() => applyNow('Dancer')}>
            <FormOutlined /> Apply As Dancer
        </Button3>
    </FirstRow>
    <SecondRow>
        <Button4 onClick={() => applyNow('Singer')}>
            <FormOutlined /> Apply As Singer
        </Button4>
        <Button5 onClick={() => applyNow('Musician')}>
            <FormOutlined /> Apply As Musician
        </Button5>
    </SecondRow>
</ButtonContainer>
                </Info>  
                <Overlays>
                    <img src={`https://api.moviemads.com/uploads/Model_Thumbnail_17d55ca8c9.jpg`} alt="Img"/>
                </Overlays>
            </Wrap>
        </Carousel>
    );
}

export default ModelSlider;

// Add ButtonContainer styled component
// const ButtonContainer = styled.div`
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: center;
//     gap: 10px;
//     margin-top: 20px;
//     @media (max-width: 768px) {
//         gap: 5px;
//         margin-top: 10px;
//     }
// `;

// // Add the additional button styles
// const Button3 = styled.button`
//     padding: 10px;
//     background: #4CAF50;
//     color: #fff;
//     border-radius: 5px;
//     font-size: 15px;
//     font-weight: bold;
//     cursor: pointer;
//     text-decoration: none;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     &:hover {
//         background-color: #303030;
//     }
//     @media (max-width: 768px) {
//         font-size: 10px;
//         padding: 5px;
//     }
// `;

// const Button4 = styled.button`
//     padding: 10px;
//     background: #2196F3;
//     color: #fff;
//     border-radius: 5px;
//     font-size: 15px;
//     font-weight: bold;
//     cursor: pointer;
//     text-decoration: none;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     &:hover {
//         background-color: #303030;
//     }
//     @media (max-width: 768px) {
//         font-size: 10px;
//         padding: 5px;
//     }
// `;

// const Button5 = styled.button`
//     padding: 10px;
//     background: rgb(131, 33, 243);
//     color: #fff;
//     border-radius: 5px;
//     font-size: 15px;
//     font-weight: bold;
//     cursor: pointer;
//     text-decoration: none;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     &:hover {
//         background-color: #303030;
//     }
//     @media (max-width: 768px) {
//         font-size: 10px;
//         padding: 5px;
//     }
// `;

// ... (keep your existing styled components)

// Update your ButtonContainer styled component
const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
    max-width: 600px;
    
    @media (max-width: 768px) {
        gap: 5px;
        margin-top: 10px;
    }
`;

const FirstRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    
    @media (max-width: 768px) {
        gap: 5px;
    }
`;

const SecondRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    
    @media (max-width: 768px) {
        gap: 5px;
    }
`;

// Base button style for consistency
const BaseButton = styled.button`
    padding: 10px;
    border-radius: 5px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-width: 120px;
    
    &:hover {
        background-color: #303030;
        color: #fff;
    }
    
    @media (max-width: 768px) {
        font-size: 10px;
        padding: 5px;
        min-width: 80px;
    }
`;

// Individual button styles
const Button1 = styled(BaseButton)`
    background-color: #ff0015;
    color: #ffffff;
`;

const Button2 = styled(BaseButton)`
    background: #fba010;
    color: #000;
`;

const Button3 = styled(BaseButton)`
    background: #4CAF50;
    color: #fff;
`;

const Button4 = styled(BaseButton)`
    background: #2196F3;
    color: #fff;
`;

const Button5 = styled(BaseButton)`
    background: rgb(131, 33, 243);
    color: #fff;
`;
const Carousel = styled(Slider)`
//   margin-top: 20px;
  ul li Button &:before {
    font-size: 10px;
    color: rgb(150, 158, 171);
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
    overflow: visible;
  }

  Button {
    z-index: 1;
  }
`;

const Wrap = styled.div`
  position: relative;
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
      height: 70%;
    }
}

  cursor: pointer;
  object-fit: cover;
  object-position: center center;
    height:80vh;
    @media (max-width: 768px) {
      height:25vh;
    }
  img {
    border: 5px solid transparent;
    opacity: 0.8;
    width:100%;
    height:100%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
      rgb(0 0 0 / 73%) 0px 16px 10px -10px;
    transition-duration: 300ms;
    // &:hover {
    //   border: 4px solid rgba(249, 249, 249, 0.8);
    // }

  }
`;

const Info = styled.div`
position: absolute;
z-index: 3;
top:50%;
left:50%;
justify-content: center;
align-items: center;
text-align: center;
transform: translate(-50%, -50%);
@media (max-width: 768px) {
  // display: none;
}
`;

// const Button1 = styled.button`
// padding: 10px;
// background-color: #ff0015;
// color: #ffffff;
// border-radius: 5px;
// font-size: 15px;
// font-weight: bold;
// cursor: pointer;
// margin-right: 8px;
// text-decoration: none;
// &:hover{
//   background-color: #303030;
// }
// @media (max-width: 768px) {
//   margin: 0px;
//   font-size: 10px;
//   margin-right: 3px;
// padding: 5px;
// }
// `;
// const Button2 = styled.button`
//   // margin: 5px;
//   padding: 10px;
//   background:#fba010;
//   color: #000;
//   font-weight: bold;
//   font-size: 15px;
//   border-radius: 5px;
//   cursor: pointer;
//   &:hover{
//     background-color: #303030;
//     color:#fff;
//   }
//   @media (max-width: 768px) {
//     margin: 0px;
//     font-size: 10px;

//   padding: 5px;
//   }
// `;

const Subtitle = styled.h2`
  color: #fff;
  font-size: 32px;
  margin-bottom: 10px;
  text-transform: uppercase;
  opacity:0.8;
  @media (max-width: 768px) {
    font-size: 15px;
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
    font-size: 10px;
  }
`;

// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useNavigate } from 'react-router-dom';
// import { FormOutlined } from "@ant-design/icons";
// import './Model.css'
// import axios from "axios";
// import { message } from "antd";

// const Token = localStorage.getItem("JwtToken");
// const USERID = localStorage.getItem('UserId');
// const API_URL = process.env.REACT_APP_API_URL;

// const ModelSlider = () => {
//   let settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//   };

//   const [movies, setMovies] = useState([]);
//   const [token, setToken] = useState(localStorage.getItem("JwtToken"));
//   const [modelExists, setModelExists] = useState(null);
//   const [agentExists, setAgentExists] = useState(false);
//   const [dancerExists, setDancerExists] = useState(false);
//   const [singerExists, setSingerExists] = useState(false);
//   const navigate = useNavigate();

//   const option1 = {
//     headers: {
//       'Authorization': `Bearer ${Token}`
//     },
//   };

//   const getSlider = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/slider-for-movie-trailers?populate[0]=movieTrailer.MovieThumbnail&populate[1]=movieTrailer.VideoFile`, option1);
//       setMovies(res?.data?.data);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   const checkExistingApplications = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/users/${USERID}?populate=model&populate=role&populate=agent_models&populate=dancer&populate=singer`);
//       setModelExists(res?.data?.model);
//       setAgentExists(res?.data?.agent_models?.length > 0);
//       setDancerExists(res?.data?.dancer !== null);
//       setSingerExists(res?.data?.singer !== null);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   useEffect(() => {
//     getSlider();
//     if (localStorage.getItem('redirect')) {
//       localStorage.removeItem('redirect');
//     }
//     if (USERID) {
//       checkExistingApplications();
//     }
//   }, [token]);

//   const applyNow = async (type) => {
//     if (!token) {
//       localStorage.setItem("redirect", window.location.pathname);
//       navigate("/login");
//       return;
//     }

//     // Check if user already has this type of application
//     switch (type) {
//       case 'Agent':
//         if (agentExists) {
//           message.error('You already applied as an Agent');
//         } else {
//           navigate("/agentModelForm");
//         }
//         break;
//       case 'Dancer':
//         if (dancerExists) {
//           message.error('You already applied as a Dancer');
//         } else {
//           navigate("/dancerForm");
//         }
//         break;
//       case 'Singer':
//         if (singerExists) {
//           message.error('You already applied as a Singer');
//         } else {
//           navigate("/singerForm");
//         }
//         break;
//       case 'Model':
//       default:
//         if (agentExists) {
//           message.error('You are registered as an Agent, please use Agent dashboard');
//         } else if (modelExists) {
//           message.error('You already applied as a Model');
//         } else {
//           navigate("/modelForm");
//         }
//         break;
//     }
//   };

//   return (
//     <Carousel {...settings}>
//       <Wrap>
//         <Info>
//           <Subtitle>Want to be an artist?<br />Choose your category</Subtitle>
//           <ButtonContainer>
//                     {/* <Button1 onClick={() => applyNow('Model')}>
//                             <FormOutlined /> Apply As Model
//                         </Button1>
//                         <Button2 onClick={() => applyNow('Agent')}>
//                             <FormOutlined /> Apply As Agent
//                         </Button2>
//                         <Button3 onClick={() => applyNow('Dancer')}>
//                             <FormOutlined /> Apply As Dancer
//                         </Button3>
//                         <Button4 onClick={() => applyNow('Singer')}>
//                             <FormOutlined /> Apply As Singer
//                         </Button4> */}

//             <a href="/modelForm" style={{ textDecoration: "none" }}><Button1>
//               <FormOutlined />Apply As Model
//             </Button1></a>
//             <a href="/agentModelForm" style={{ textDecoration: "none" }}><Button2>
//               <FormOutlined /> Apply As Agent
//             </Button2></a>
//             <a href="/dancerForm" style={{ textDecoration: "none" }}><Button3>
//               <FormOutlined /> Apply As Dancer
//             </Button3></a>
//             <a href="/singerForm" style={{ textDecoration: "none" }}> <Button4>
//               <FormOutlined />Apply As Singer
//             </Button4></a>
//                <a href="/musicianForm" style={{ textDecoration: "none" }}> <Button5>
//               <FormOutlined />Apply As Musician
//             </Button5></a>
//           </ButtonContainer>
//         </Info>
//         <Overlays>
//           <img src={`https://api.moviemads.com/uploads/Model_Thumbnail_17d55ca8c9.jpg`} alt="Img" />
//         </Overlays>
//       </Wrap>
//     </Carousel>
//   );
// }

// export default ModelSlider;

// // Styled components (updated with new button styles)
// const Carousel = styled(Slider)`
//     ul li Button &:before {
//         font-size: 10px;
//         color: rgb(150, 158, 171);
//     }
//     .slick-next:before {
//         color: #ff0015;
//         font-size: 40px;
//         font-weight: bold;
//         opacity: 100%;
//     }
//     .slick-prev:before {
//         color: #ff0015;
//         font-size: 40px;
//         font-weight: bold;
//         opacity: 100%;
//     }
//     @media (max-width: 768px) {
//         .slick-next:before, .slick-prev:before {
//             display: none;
//         }
//     }
    
//     li.slick-active Button1::before {
//         color: white;
//         display: none;
//     }
//     .slick-list {
//         overflow: visible;
//     }
//     Button {
//         z-index: 1;
//     }
// `;

// const Wrap = styled.div`
//     position: relative;
//     &:after {
//         content: "";
//         position: absolute;
//         width: 100%;
//         height: 45%;
//         background: linear-gradient(to bottom, rgba(255, 255, 255, 0)0%, #000000 100%);
//         bottom: 0;
//         right: 0;
//         pointer-events: none;
//         @media (max-width: 768px) {
//             height: 70%;
//         }
//     }
//     cursor: pointer;
//     object-fit: cover;
//     object-position: center center;
//     height: 80vh;
//     @media (max-width: 768px) {
//         height: 25vh;
//     }
//     img {
//         border: 5px solid transparent;
//         opacity: 0.8;
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//         border-radius: 10px;
//         box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
//             rgb(0 0 0 / 73%) 0px 16px 10px -10px;
//         transition-duration: 300ms;
//     }
// `;

// const Info = styled.div`
//     position: absolute;
//     z-index: 3;
//     top: 50%;
//     left: 50%;
//     justify-content: center;
//     align-items: center;
//     text-align: center;
//     transform: translate(-50%, -50%);
//     @media (max-width: 768px) {
//         width: 100%;
//     }
// `;

// const ButtonContainer = styled.div`
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: center;
//     gap: 10px;
//     margin-top: 20px;
//     @media (max-width: 768px) {
//         gap: 5px;
//         margin-top: 10px;
//     }
// `;

// const ButtonBase = styled.button`
//     padding: 10px;
//     border-radius: 5px;
//     font-size: 15px;
//     font-weight: bold;
//     cursor: pointer;
//     text-decoration: none;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     &:hover {
//         background-color: #303030;
//         color: #fff;
//     }
//     @media (max-width: 768px) {
//         font-size: 10px;
//         padding: 5px;
//     }
// `;

// const Button1 = styled(ButtonBase)`
//     background-color: #ff0015;
//     color: #ffffff;
// `;

// const Button2 = styled(ButtonBase)`
//     background: #fba010;
//     color: #000;
// `;

// const Button3 = styled(ButtonBase)`
//     background: #4CAF50;
//     color: #fff;
// `;

// const Button4 = styled(ButtonBase)`
//     background: #2196F3;
//     color: #fff;
// `;

// const Button5 = styled(ButtonBase)`
//     background:rgb(131, 33, 243);
//     color: #fff;
// `;

// const Subtitle = styled.h2`
//     color: #fff;
//     font-size: 32px;
//     margin-bottom: 10px;
//     text-transform: uppercase;
//     opacity: 0.8;
//     @media (max-width: 768px) {
//         font-size: 15px;
//         margin-bottom: 1px;
//     }
// `;

// const Overlays = styled.div`
//     background: rgba(0, 0, 0, 0.9);
//     width: 100%;
//     height: 100%;
// `;