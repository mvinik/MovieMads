// VideoModal.js
import { notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const user = localStorage.getItem("UserId");
const Token = localStorage.getItem("JwtToken");
const API_URL = process.env.REACT_APP_API_URL;

Modal.setAppElement('#root');

const VideoModal = ({ showModal, handleClose }) => {
  const [isParticipated, setIsParticipated] = useState(false);
  const [contestDetails, setContestDetails] = useState(0);
  const navigate = useNavigate();

  const IsApplied = async () => {
    if (user) {
      try {
        const response = await axios.get(`${API_URL}/api/users/${user}?populate=contest,contest.MovieThumbnail,contest.MoviePoster,contest.VideoFile`);
        if (response.data.contest) {
          setIsParticipated(true);
          setContestDetails(response.data.contest);
          localStorage.setItem('formId', response.data.contest.id);

          if (response.data.contest.Payment === 'Paid') {
            notification.error({
              message: 'Upload Error',
              description: 'You Already Participated In The Contest',
              placement: 'top'
            });
          } else {
            navigate('/Contest');
          }

          const hasUploaded = response.data.contest.MovieThumbnail && response.data.contest.MoviePoster && response.data.contest.VideoFile;
          setIsParticipated(hasUploaded);
        } else {
          navigate('/Contest');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.setItem('redirect', '/Contest');
      navigate('/login');
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          padding: '0',
          border: 'none',
          background: 'transparent',
          overflow: 'visible',
          zIndex: 1000,
          maxWidth: '600px',
          width: "90%"
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 999
        },
      }}
    >
      <VideoContainer>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <ContentBox>
          <h2 className=''>🚨 FLASH OFFER ALERT!</h2>
          <p>
            Turn your dreams into reality with <strong>Moviemads Models</strong> – now at just <Price>₹99</Price>
          </p>
          <ul>
            <li>📸 Aspiring model? Actor? Influencer?</li>
            <li>🌟 Connect with casting directors</li>
            <li>🎬 Get noticed for real projects</li>
            <li>💼 Be seen. Be booked. Be famous</li>
          </ul>
          {/* <p className="shine">This is <em>YOUR</em> time to shine.</p> */}
          <p className="note">⏳ <strong>Limited seats. Unlimited dreams.</strong></p>
          <ActionButton onClick={() => navigate('/model')}>
            Login now & grab your spotlight!
          </ActionButton>
        </ContentBox>
      </VideoContainer>
    </Modal>
  );
};

export default VideoModal;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: black;
  padding: 2rem;
  border-radius: 16px;
  border: 3px solid red;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  max-width: 600px;
  color: white;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentBox = styled.div`
  font-family: 'Arial', sans-serif;

  h2 {
    color: #ff0015;
    font-size: 2rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
      text-align: center;
    }
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 1rem 0;

    li {
      margin: 0.5rem 0;
      font-size: 1rem;

      @media (max-width: 768px) {
        font-size: 0.95rem;
      }
    }
  }

  .note {
    margin-top: 1rem;
    font-size: 1.1rem;
    color: #ffeb3b;

    @media (max-width: 768px) {
      font-size: 1rem;
      text-align: center;
    }
  }
`;

const Price = styled.span`
  color: #ff0015;
  font-weight: bold;
`;

const ActionButton = styled.button`
  background: #ff0015;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: 0.3s ease;
  width: 100%;

  &:hover {
    background: #d32f2f;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  color: white;
  cursor: pointer;

  &:hover {
    color: #ff5252;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    top: 8px;
    right: 10px;
  }
`;
