import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;
    //   const API_URL = process.env.REACT_APP_API_URL;
  const JWT = localStorage.getItem("User");
  const Token = localStorage.getItem("JwtToken");
  const USERID = localStorage.getItem("UserId");

function ShortFilmPlayer() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
    const [price, setPrice] = useState(0)


  const headers = {
    headers: {
      'Authorization': `Bearer ${Token}`
    },
  };

  useEffect(() => {
    axios.get(`${API}/api/short-films/${id}?populate=*`)
      .then(res => setFilm(res.data.data.attributes));
    
    // Check if user has access
    axios.get(`${API}/api/short-film-purchases?filters[user]=${USERID}&filters[shortFilm]=${id}&filters[isPaid]=true`, headers)
      .then(res => {
        if (res.data.data.length > 0) setHasAccess(true);
      });
  }, [id]);

  const handlePlay = () => {
    if (!hasAccess) {
      alert("Please pay to watch this short film.");
      return;
    }
    const video = document.getElementById("video-player");
    video.play();
  };

  const handlePayment = async () => {
    const keyRes = await axios.get(`${API}/api/razorpay`, headers);
    const keyId = keyRes.data.keyId;

    const orderRes = await axios.post(`${API}/api/short-films/${id}/create-order`, {}, headers);
    const order = orderRes.data;

    const options = {
      key: keyId,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      handler: async (response) => {
        await axios.post(`${API}/api/short-film-purchase/verify`, {
          razorpay_order_id: order.id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          shortFilmId: id
        }, headers);
        setHasAccess(true);
        alert("Payment successful! You can now watch the film.");
      }
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div>
      {film && (
        <>
          <h1>{film.MovieName}</h1>
          <img src={film.MovieThumbnail?.data?.attributes?.formats?.thumbnail?.url} alt={film.title} style={{ width: "300px" }} />
          <p>{film.description}</p>
          {hasAccess ? (
            <video id="video-player" width="600" controls>
              <source src={film.videoFile?.data?.attributes?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <button onClick={handlePayment}>Pay ₹{film.price} to Watch</button>
          )}
          <button onClick={handlePlay}>Play Video</button>
        </>
      )}
    </div>
  );
}

export default ShortFilmPlayer;
