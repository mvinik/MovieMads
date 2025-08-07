import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Skeleton } from "antd";
import { EyeOutlined, ClockCircleOutlined, HeartOutlined, HeartFilled, StarFilled, StarOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import Footer from "../Footer/Footer";
import YouMayLike from "../YouMayLike";
import Topnav from "../TopNav/Topnav";
import Header from "../Header";
// 1️⃣ Add new imports
import { message, Button } from 'antd';
import qs from 'qs';

function ShortDetails() {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null); // Initialize details state as null
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [showModal, setShowModal] = useState(false); // State to toggle modal
  const [videoId, setVideoId] = useState(null); // State to store YouTube video ID
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [rating, setRating] = useState(0);
  const [movies, setMovies] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const JWT = localStorage.getItem("User");
  const Token = localStorage.getItem("JwtToken");
  const UserId = localStorage.getItem("UserId");
  const [refreshIsMovieLiked, setRefreshIsMovieLiked] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false); // Track purchase status
const [likeLoading, setLikeLoading] = useState(false);
  const option1 = {
    headers: {
      'Authorization': `Bearer ${Token}`
    },
  };
  if (localStorage.getItem('redirect')) {
    localStorage.removeItem('redirect')
    // window.location.reload();
  }
  const fetchShortFlim = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/shortfilm-uploads/${id}?populate=*`);
      const responseData = response.data.data;
      // setPrice(responseData?.attributes?.Price);
      // console.log(price,'price')
      setDetails(responseData);
      console.log("response data", responseData);
      
      setViews(responseData.attributes.views)
      console.log(views,'views')
      setLikes(responseData.attributes.likes)
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      console.error(err);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const IsUserLiked = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${UserId}?populate=*`, option1);
      const responseData = response;
      console.log("Liked data", responseData);
      if (responseData.data.liked_movie) { localStorage.setItem('LikedMovieId', responseData.data.liked_movie.id); } else { setLiked(false); }
    } catch (err) {
      console.error(err);
    }
  }
  const LikedMovieId = localStorage.getItem('LikedMovieId');

  const GetLikedMovies = async () => {
    try {
      // console.log("Liked Movie checvk");
      if (LikedMovieId) {
        const response = await axios.get(`${API_URL}/api/liked-movies/${LikedMovieId}?populate[shortfilm_uploads]=*`, option1);
        const responseData = response;
        console.log("Liked Movies data", responseData?.data?.data?.attributes?.shortfilm_uploads?.data);
        setMovies(responseData?.data?.data?.attributes?.shortfilm_uploads?.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const IsMovieLiked = () => {

    const isLiked = movies.some(movie => movie.id.toString() == id.toString());
    if (isLiked) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  const getViews = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/shortfilm-uploads/${id}/view`, {}, option1);
      const responseData = response.data;
      setViews(responseData.views);
      console.log("View response data", responseData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    IsMovieLiked();
  }, [movies]);

  const checkIfPurchased = async () => {
    if (!UserId || !id) {
      setHasPurchased(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/short-film-orders`,
        {
          ...option1,
          params: {
            'filters[users_permissions_users][id]': UserId,
            'filters[shortfilm_uploads][id]': id,
            populate: '*' // Get full order details
          }
        }
      );

      // Check if any order has Status: 'paid'
      const hasPaidOrder = res.data.data.some(order =>
        order.Status === 'paid' &&
        order.users_permissions_users?.some(user => user.id === Number(UserId)) &&
        order.shortfilm_uploads?.some(film => film.id === Number(id))
      );

      setHasPurchased(hasPaidOrder);

      // Debug logging
      // console.log('Purchase verification:', {
      //   userId: UserId,
      //   filmId: id,
      //   orders: res.data.data,
      //   hasAccess: hasPaidOrder
      // });

    } catch (err) {
      console.error("Purchase check failed:", err);
      setHasPurchased(false);
    }
  };


  const handlePayment = async () => {
    try {
      const price = details?.attributes?.Price;
      console.log('frontend price', price);

      if (!price) {
        throw new Error("Price not available");
      }

      // 1. Create order with price from frontend
      const { data: orderResponse } = await axios.post(
        `${API_URL}/api/short-film-orders`,
        {
          data: {
            shortfilm: id,
            amount: price, // Price in rupees
            user: UserId
          }
        },
        option1
      );

      const order = orderResponse?.data;

      // 2. Get Razorpay key
      const razorpayConfig = await axios.get(`${API_URL}/api/razorpay`, option1);

      // 3. Initialize Razorpay payment
      const options = {
        key: razorpayConfig?.data?.data?.attributes?.keyId,
        amount: order.amount * 100, // ✅ Convert rupees to paise
        currency: "INR",
        order_id: order.orderId, // From backend
        name: "MovieMads",
        description: `Purchase: ${details?.attributes?.MovieName}`,
        handler: async function (response) {
          try {
            // 4. Verify payment on backend
            await axios.post(
              `${API_URL}/api/short-film-purchases/verify`,
              {
                paymentResponse: response,
                orderData: order
              },
              option1
            );

            console.log("Final Razorpay options:", options);
            message.success("Payment successful!");
            setHasPurchased(true);
            setShowModal(true); // Show video modal
          } catch (error) {
            console.error("Verification failed:", error);
            message.error("Payment verification failed");
          }
        },
        prefill: {
          name: localStorage.getItem('Username') || "User",
          email: localStorage.getItem('UserEmail') || "",
        },
        theme: {
          color: "#F37254"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      message.error(error.response?.data?.message || "Payment failed");
    }
  };

  // 3️⃣ Run on load
  useEffect(() => {
    fetchShortFlim();
    IsUserLiked();
    GetLikedMovies();
    checkIfPurchased();
  }, [id]);

  // 4️⃣ Modified Play Button Logic
  const handlePlayButtonClick = () => {
    if (!JWT) {
      localStorage.setItem('redirect', window.location.pathname);
      return navigate('/login');
    }

    if (hasPurchased) {
      setShowModal(true);
      getViews();
    } else {
      message.warning("Please purchase this film to watch");
      // Optionally auto-scroll to payment button
      document.getElementById('payment-button')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    return () => setShowModal(false);
  }, []);

  const closeModal = () => {
    setShowModal(false);
    // setVideoId(null);
  };

const toggleLike = async () => {
  if (likeLoading) return;
  
  if (!JWT) {
    localStorage.setItem('redirect', window.location.pathname);
    navigate('/login');
    return;
  }

  setLikeLoading(true);
  try {
    // Optimistic UI update
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);
    
    const response = await axios.post(
      `${API_URL}/api/shortfilm-uploads/${id}/like`, 
      {}, 
      option1
    );
    
    // Handle response
    if (response.data?.likes !== undefined && response.data?.isLiked !== undefined) {
      setLikes(response.data.likes);
      setLiked(response.data.isLiked);
      // Refresh liked movies list
      await GetLikedMovies();
    } else {
      throw new Error("Invalid response format");
    }
  } catch (err) {
    console.error("Like error:", {
      message: err.message,
      response: err.response?.data
    });
    // Revert UI on error
    setLiked(prev => !prev);
    setLikes(prev => liked ? prev + 1 : prev - 1);
    message.error(err.response?.data?.error || "Failed to update like");
  } finally {
    setLikeLoading(false);
  }
};
  const handleStarClick = (value) => {
    setRating(value); // Update the rating when a star is clicked
    // You can also send a request to your backend API to update the rating
  };

  // Function to render star icons based on current rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarFilled key={i} style={{ color: 'gold', cursor: 'pointer' }} onClick={() => handleStarClick(i)} />);
      } else {
        stars.push(<StarOutlined key={i} style={{ color: 'gold', cursor: 'pointer' }} onClick={() => handleStarClick(i)} />);
      }
    }
    return stars;
  };


  return (
    <>
      <Topnav />
      <Header />
      <Container>
        {loading ? (
          <Skeleton
            avatar
            paragraph={{
              rows: 4,
            }}
          />
        ) : (
          <>
            <Backdrop>
              <img
                alt="Backdrop"
                src={`${API_URL}${details?.attributes?.MovieThumbnail?.data?.attributes?.url}`}
              />
              <PlayButton onClick={handlePlayButtonClick}>
                <img src="/images/play-icon-black.png" alt="" />
              </PlayButton>

              {!hasPurchased && (
                <Button
                  id="payment-button"
                  type="primary"
                  onClick={handlePayment}
                  style={{
                    marginTop: '10px',
                    background: ' #ff0015',
                    borderColor: '#e50914'
                  }}
                >
                  Purchase for ₹{details?.attributes?.Price}
                </Button>
              )}


              <Controls>
                <Like onClick={toggleLike}>
                  {liked ? (
                    <HeartFilled style={{ color: "gold" }} />
                  ) : (
                    <HeartOutlined />
                  )}{" "}
                  {likes} likes
                </Like>
                <Views>
                  {" "}
                  <EyeOutlined style={{ color: "gold" }} />{" "}
                  {details?.attributes?.views} Views
                </Views>
                {/* <ReleaseDate><CalendarOutlined /> {details?.release_date} 24th Feb 2024</ReleaseDate> */}
                <Duration>
                  <ClockCircleOutlined style={{ color: "gold" }} />{" "}
                  {details?.attributes?.Duration} Mins{" "}
                </Duration>
                <Popularity>
                  <StarOutlined style={{ color: "gold" }} /> 4.5/ 5 Ratings
                </Popularity>
                {/* <p>Price: ₹{details.attributes.Price}</p> */}
              </Controls>
            </Backdrop>

            <DetailsContainer>
              <Title>{details?.attributes?.MovieName} </Title>
              <Lang>
                {details?.attributes?.Genres}
                <span
                  style={{
                    fontWeight: "bold",
                    color: "red",
                    fontSize: "1.5em",
                    padding: '5px',
                  }}
                >
                  |
                </span>
                {details.attributes.Language}
              </Lang>
              <ActorName>
                <span>
                  <StarOutlined /> Actors:{" "}
                </span>{" "}
                {details.attributes.Actors}
              </ActorName>
              <ActorName>
                <span>
                  <VideoCameraAddOutlined /> Director:{" "}
                </span>
                {details.attributes.Directors}{" "}
              </ActorName>
              {/* <ActorName><span><TranslationOutlined />  </span> {details.attributes.Language}</ActorName> */}
              <Description>{details.attributes.Description} </Description>
              <div>{renderStars()}</div>
              <p>Your rating: {rating}</p>
            </DetailsContainer>
          </>
        )}
      </Container>
      {showModal && (
        <CustomModal API_URL={API_URL} details={details} onClose={closeModal} />
      )}
      {/*<YouMayLike id={id} />*/}
      <Footer />
    </>
  );
}
export default ShortDetails;

const Container = styled.div`
display: flex;
justify-content: space-between;
padding: 0 calc(3.5vw + 5px);
margin-bottom: 5rem;
@media (max-width: 768px) {
flex-direction: column;
margin-bottom: 0rem;
}
`;

const Backdrop = styled.div`
position: relative;
flex: 0 0 60%; /* Adjust as needed */
margin-right: 20px; /* Add some space between backdrop and details */
max-width: 60%;
max-height: 50vh;
@media (max-width: 768px) {
max-width: 100%;
max-height: 100%;
margin-right: 0px;
}
img {
width: 100%;
height: 100%;
object-fit: cover;
border-radius: 12px;
}
`;

const PlayButton = styled.button`

position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
cursor: pointer;
background: rgba(255, 255, 255, 0.8);;
color: white;
border: none;
padding: 25px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 18px;

&:hover {
background: #ffffff;
}

@media (max-width: 768px) {
font-size: 12px;
padding: 12px;
}
&::after {
content: '';
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 0;
height: 0;
background-color: rgba(255, 255, 255, 0.3);
border-radius: 50%;
transition: width 0.3s, height 0.3s;
z-index: -1;
}

&:hover::after {
width: 200%;
height: 200%;
}

`;

const DetailsContainer = styled.div`
flex: 0 0 40%; /* Adjust as needed */
@media (max-width: 768px) {
margin-top: 20px;
font-size: 12px;
margin-bottom:5rem;
}
`;
const Controls = styled.div`
position: absolute;
display: flex;
flex-direction: row;
gap: 20px;
left: 20px;

@media (max-width: 768px) {
font-size: 10px;
left: 10px;
}
`;
const Views = styled.p`
`;
const Like = styled.p`
&:hover {
cursor: pointer;
}
`;

const ReleaseDate = styled.p`
`;
const Duration = styled.p`
`;
const Popularity = styled.p`
`;
const Title = styled.h2`
margin-bottom: 0px;
text-transform: uppercase;
`;

const Description = styled.p`
line-height: 1.4;
`;
const ActorName = styled.p`
line-height: 1.4;
span {
font-weight: bold;
text-transform: uppercase;
color: #e50914;
}
`;
const Lang = styled.p`
margin: 0;
font-weight: bold;
font-size: 1em;
span {
font-weight: bold;
text-transform: uppercase;
}
`;

const ModalBackdrop = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 10;
`;

const ModalContent = styled.div`
// width: 70%;
// z-index: 10;
@media (max-width: 768px) {
padding: 3px;
}
iframe {
width:750px;
height: 422px;
border-color: #e50914;
@media (max-width: 768px) {
width: 90vw;
height: 30vh;
object-fit: cover;
}
}
`;

const CloseButton = styled.button`
position: absolute;
top: 10px;
right: 10px;
cursor: pointer;
`;


const CustomModal = ({ onClose, API_URL, details }) => {

  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <ModalBackdrop>
      <ModalContent>
        <Modal
          open={true} // Ensure the modal is visible
          onCancel={onClose}
          style={{ objectFit: 'cover', justifyContent: 'center', alignItems: 'center' }}
          footer={null}
          width={800} // Adjust width as needed
          className="custom-modal"
        >
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              {details?.attributes?.VideoFile?.data !== null && details?.attributes?.VideoFile?.data !== undefined ? (
                <video style={{ height: '100%', width: '100%' }} controls autoPlay loop>
                  <source src={`${API_URL}${details?.attributes?.VideoFile?.data[0]?.attributes?.url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe src={details?.attributes.videoEmbedCode} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
              )}
            </>
          )}
        </Modal>
      </ModalContent>
    </ModalBackdrop>
  );
};


