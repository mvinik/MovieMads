import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { InfoCircleFilled, PlayCircleFilled, DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { message, Card, Row, Col, Button } from 'antd';
import styled from "styled-components";
import { UploadOutlined } from '@ant-design/icons';

const { Meta } = Card;

const API_URL = process.env.REACT_APP_API_URL;
const Token = localStorage.getItem("JwtToken");
const userId = localStorage.getItem("UserId");

function ShortFilmGrid() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [price, setPrice] = useState(0);
  const [purchasedMovies, setPurchasedMovies] = useState([]);
 const [isMobile, setIsMobile] = useState(false);
  // Fetch all data
  useEffect(() => {
    getShortFilms();

    getPurchasedMovies();
  }, []);

  const getShortFilms = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/shortfilm-uploads?populate=*`);
      setMovies(res.data.data);
      // setPrice(res?.data?.data?.attributes?.Price)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching short films:", error);
      message.error("Failed to load short films");
      setLoading(false);
    }
  };

  const getPurchasedMovies = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `${API_URL}/api/short-film-orders?filters[users_permissions_users][id][$eq]=${userId}&populate=shortfilm_uploads`,
        option1
      );

      console.log('purchase id res', res);

      const purchasedIds = res.data.data.flatMap(order => {
        if (order.Status === 'paid' && Array.isArray(order.shortfilm_uploads)) {
          return order.shortfilm_uploads.map(film => film.id);
        }
        return [];
      });

      setPurchasedMovies(purchasedIds);
      console.log("Purchased film IDs:", purchasedIds);

    } catch (error) {
      console.error("Error fetching purchases:", {
        message: error.message,
        response: error.response?.data
      });
    }
  };

    useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const option1 = {
    headers: {
      'Authorization': `Bearer ${Token}`,
      'Content-Type': 'application/json'
    }
  };

  // const getAmount = async () => {
  //   try {
  //     const res = await axios.get(`${API_URL}/api/price?populate=*`);
  //     setPrice(res?.data?.data?.attributes?.ShortFilmPrice);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handlePayment = async (movieId) => {
  //   try {
  //     const response = await axios.get(`${API_URL}/api/razorpay`, option1);
  //     const { data: order } = await axios.post(
  //       `${API_URL}/api/shortfilm-uploads/${price}/create-order`,
  //       { movieId } // Pass movie ID to associate payment
  //     );

  //     const options = {
  //       key: response.data.data.attributes.keyId,
  //       key_secret: response.data.data.attributes.keySecret,
  //       amount: order.price,
  //       currency: "INR",
  //       order_id: order.id,
  //       name: "MovieMads",
  //       description: `Payment for movie access`,
  //       handler: async function (Paymentresponse) {
  //         try {
  //           await axios.post(
  //             `${API_URL}/api/short-film-purchases`,
  //             {
  //               data: {
  //                 user: userId,
  //                 movie: movieId,
  //                 paymentId: Paymentresponse.razorpay_payment_id,
  //                 amount: price
  //               }
  //             },
  //             option1
  //           );
  //           message.success('Payment successful! Movie unlocked.');
  //           getPurchasedMovies(); // Refresh purchased movies list
  //         } catch (error) {
  //           console.error("Payment processing error:", error);
  //           message.error('Payment verification failed');
  //         }
  //       },
  //       prefill: {
  //         name: localStorage.getItem('Username') || '',
  //         email: localStorage.getItem('EmailId') || ''
  //       }
  //     };

  //     const pay = new window.Razorpay(options);
  //     pay.open();
  //   } catch (error) {
  //     console.error("Payment initialization error:", error);
  //     message.error('Failed to initialize payment');
  //   }
  // };


  const hasPurchased = (movieId) => {
    return purchasedMovies.includes(movieId);
  };

  return (
   <div style={{ padding: '20px', maxWidth: '1280px', margin: '0 auto' }}>
     <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexDirection: isMobile ? "row" : "row",
        gap: isMobile ? "12px" : "0px",
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "18px" : "24px",
          fontWeight: "600",
          margin: 0,
        }}
      >
        SHORT FILMS
      </h2>

      <a href="/shortfilmuploadForm" style={{ textDecoration: "none" }}>
        <Button
          type="primary"
          icon={<UploadOutlined style={{ fontSize: isMobile ? "14px" : "18px" }} />}
          style={{
            backgroundColor: "#ff0015",
            borderColor: "rgb(206, 23, 38)",
            color: "#ffffff",
            fontWeight: "500",
            borderRadius: "6px",
            padding: isMobile ? "3px 10px" : "4px 12px",
            fontSize: isMobile ? "12px" : "14px",
            boxShadow: "0 3px 8px rgba(29, 20, 20, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: isMobile ? "32px" : "38px",
          }}
        >
       Upload
        </Button>
      </a>
    </div>


      {loading ? (
        <div>Loading...</div>
      ) : (
<Row gutter={[24, 24]}>
  {movies.map((movie) => (
    <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
                padding: "20px",
              }}>
              <div
                onMouseEnter={() => setHoveredCard(movie.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/shortflimDetails/${movie.id}`}>
                  <Card
                    hoverable
                    style={{
                      width: 300,
                      height: '100%',
                      borderRadius: 20,
                      backgroundColor: '#0d0d0d',
                      border: '1px solid #1a1a1a',
                      overflow: 'hidden',
                      boxShadow: '0 15px 50px rgba(0,0,0,0.8)',
                      transition: 'transform 0.3s ease',
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    {/* Cover Image with Floating Price Tag */}
                    <div style={{ position: 'relative' }}>
                      <img
                        alt={movie.attributes.MovieName}
                        src={
                          movie.attributes.MovieThumbnail?.data?.attributes?.url
                            ? `${API_URL}${movie.attributes.MovieThumbnail.data.attributes.url}`
                            : 'https://via.placeholder.com/300x169'
                        }
                        style={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          transition: 'all 0.3s ease-in-out',
                          filter: 'brightness(0.9)',
                        }}
                      />
                      {/* Ribbon Price */}
                      <div style={{
                        position: 'absolute',
                        top: 14,
                        right: -35,
                        background: 'linear-gradient(135deg, #ffcc00, #ff8800)',
                        transform: 'rotate(45deg)',
                        width: 110,
                        textAlign: 'center',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: 14,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}>
                        ₹{movie.attributes.Price}
                      </div>
                    </div>

                    {/* Details Section */}
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <h3 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 10,
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        🎬 {movie.attributes.MovieName}
                      </h3>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                        fontSize: 13,
                      }}>
                        <span style={{ color: '#ccc' }}>
                          <ClockCircleOutlined /> {movie.attributes.Duration} min
                        </span>
                        <span style={{
                          background: '#e50914',
                          padding: '2px 10px',
                          borderRadius: 12,
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 11,
                          boxShadow: '0 0 10px #e50914aa',
                        }}>
                          {movie.attributes.Language}
                        </span>
                      </div>

                      <div style={{
                        background: '#222',
                        padding: '6px 12px',
                        borderRadius: 16,
                        color: '#fba010',
                        fontWeight: 600,
                        fontSize: 13,
                        width: 'fit-content',
                        marginBottom: 20,
                        boxShadow: '0 0 6px #fba01055',
                      }}>
                        🎞 {movie.attributes.Genres}
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        marginTop: 'auto',
                      }}>
                        {hasPurchased(movie.id) ? (
                          <Link to={`/shortflimDetails/${movie.id}`} style={{ flex: 1 }}>
                            <Button
                              icon={<PlayCircleFilled />}
                              style={{
                                background: ' #ff0015',
                                color: '#fff',
                                fontWeight: 700,
                                border: 'none',
                                height: 45,
                                borderBottomLeftRadius: 20,
                                transition: '0.3s',
                              }}
                            >
                              Watch Now
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            icon={<DollarOutlined />}
                            // onClick={() => handlePayment(movie.id)}
                            style={{
                              background: ' #fba010',
                              color: '#000',
                              fontWeight: 700,
                              border: 'none',
                              height: 45,
                              borderBottomLeftRadius: 20,
                              transition: '0.3s',
                            }}
                          >
                            Buy Now
                          </Button>
                        )}

                        <Link to={`/shortflimDetails/${movie.id}`} style={{ flex: 1 }}>
                          <Button
                            icon={<InfoCircleFilled />}
                            style={{
                              background: '#1a1a1a',
                              color: '#fff',
                              fontWeight: 700,
                              border: 'none',
                              height: 45,
                              borderBottomRightRadius: 20,
                            }}
                          >
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>

                </Link>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

const StyledCard = styled(Card)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.4);

    .ant-card-cover {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(229, 9, 20, 0.1);
      }
    }
  }

  .ant-card-body {
    padding: 0;
  }

  .ant-card-actions {
    background: #1a1a1a;
    border-top: 1px dashed #444 !important;
    margin: 0;
    padding: 0;

    li {
      margin: 0 !important;
      border: none !important;
    }
  }
`;

export default ShortFilmGrid;