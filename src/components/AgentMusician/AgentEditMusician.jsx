import axios from 'axios'
import React from 'react'
import { useEffect ,useRef} from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer/Footer'
import Topnav from '../TopNav/Topnav'
import { message } from 'antd';
import './Musician.css'
import { PlusOutlined } from '@ant-design/icons'

const USERID = localStorage.getItem('UserId');
const API_URL = process.env.REACT_APP_API_URL;

const AgentEditMusician = ({count}) => {
  const [agentMusicians, setAgentMusicians] = useState([]);
  const [editingMusicianId, setEditingMusicianId] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedMusicianId, setSelectedMusicianId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [imageId, setImageId] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMusicians = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/users/${USERID}?populate[agent_musicians][populate][Poster]=*&populate[agent_musicians][populate][Thumbnail]=*&populate[agent_musicians][populate][Images]=*&populate[agent_musicians][populate][VideoFile]=*`
        );
         console.log('API Response:', res.data); // Log the entire response
      
      const musicians = res.data.agent_musicians || [];
      console.log('Agent Musicians:', musicians); // Log the musicians array
      
        setAgentMusicians(musicians);
        setUserDetails(res.data);
        
        // Initialize form data for each musician
        const initialFormData = {};
        musicians.forEach(musician => {
          initialFormData[musician.id] = {
            Name: musician.Name || '',
            Description: musician.Description || '',
            MusicalGeners: musician.MusicalGeners || '',
            Age: musician.Age || '',
            Yearofexperience: musician.Yearofexperience || '',
            BandExperience: musician.BandExperience || '',
              CanReadMusic: musician.CanReadMusic || '',
              PrimaryInstrument: musician.PrimaryInstrument || '',
                FormalTraining: musician.FormalTraining || '',
                PerformanceType: musician.PerformanceType|| '',
                  MusicalGeners: musician.MusicalGeners || '',
           
          };
        });
        setFormData(initialFormData);
      } catch (err) {
        console.error('Error fetching agent musicians:', err);
      }
    };

    fetchMusicians();
  }, []);

  const handleInputChange = (e, musicianId) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [musicianId]: {
        ...prev[musicianId],
        [name]: value
      }
    }));
  };

  const toggleEditing = (musicianId) => {
    setEditingMusicianId(editingMusicianId === musicianId ? null : musicianId);
  };

  const saveMusician = async (musicianId) => {
    try {
      await axios.put(`${API_URL}/api/agent-musicians/${musicianId}`, {
        data: formData[musicianId]
      });
      message.success('Agent Musician updated successfully!');
      toggleEditing(musicianId);
      window.location.reload();
    } catch (err) {
      console.error('Error saving musician:', err);
      message.error('Failed to update musician');
    }
  };

  const handleSvgClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedMusicianId) return;

    try {
      const formData = new FormData();
      formData.append('files', selectedFile);

      let endpoint = `${API_URL}/api/upload`;
      let additionalData = {};

      if (modalType === 'Poster') {
        additionalData = { caption: 'Poster' };
        const musician = agentMusicians.find(m => m.id === selectedMusicianId);
        if (musician?.Poster[0]?.id) {
          endpoint = `${API_URL}/api/upload?id=${musician.Poster[0].id}`;
        }
      } else if (modalType === 'Thumbnail') {
        additionalData = { caption: 'Thumbnail' };
        const musician = agentMusicians.find(m => m.id === selectedMusicianId);
        if (musician?.Thumbnail[0]?.id) {
          endpoint = `${API_URL}/api/upload?id=${musician.Thumbnail[0].id}`;
        }
      } else if (modalType === 'Images') {
        additionalData = { caption: 'Images' };
        if (imageId) {
          endpoint = `${API_URL}/api/upload?id=${imageId}`;
        } else {
          formData.append('ref', 'api::agent-musician.agent-musician');
          formData.append('refId', selectedMusicianId);
          formData.append('field', 'Images');
        }
      } else if (modalType === 'VideoFile') {
        if (selectedFile.size > 50 * 1024 * 1024) {
          message.error('Video file too large (max 50MB)');
          return;
        }
        
        additionalData = {
          caption: 'Musician Video',
          alternativeText: `Video for musician ${selectedMusicianId}`
        };
        
        const musician = agentMusicians.find(m => m.id === selectedMusicianId);
        if (musician?.VideoFile?.[0]?.id) {
          endpoint = `${API_URL}/api/upload?id=${musician?.VideoFile[0]?.id}`;
        } else {
          formData.append('ref', 'api::agent-musician.agent-musician');
          formData.append('refId', selectedMusicianId);
          formData.append('field', 'VideoFile');
        }
      }

      formData.append('fileInfo', JSON.stringify(additionalData));
      
      await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      message.success(`${modalType === 'VideoFile' ? 'Video' : 'Image'} uploaded successfully!`);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Upload error:', err);
      message.error(`Failed to upload ${modalType === 'VideoFile' ? 'video' : 'image'}`);
    }
  };

  const openModal = (type, musicianId, img = '', imgId = '') => {
    setIsModalOpen(true);
    setModalType(type);
    setSelectedMusicianId(musicianId);
    // setCurrentImage(img);
    setImageId(imgId);
  };

  const ProfileModal = ({ closeModal }) => {
    return (
      <div className="modal" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div className="modal-content1" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <span className="close" onClick={closeModal} style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#333'
          }}>
            &times;
          </span>
          
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
            Change {modalType === 'VideoFile' ? 'Video' : 'Image'}
          </h2>

          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div 
              style={{
                border: '2px dashed #c71b29',
                padding: '30px',
                textAlign: 'center',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9'
              }}
              onClick={handleSvgClick}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#c71b29" 
                strokeWidth="2"
                style={{ marginBottom: '10px' }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p style={{ margin: '10px 0', color: '#666' }}>
                Click to select {modalType === 'VideoFile' ? 'a video file' : 'an image'}
              </p>
              <input 
                ref={fileInputRef}
                type="file" 
                name={modalType === 'VideoFile' ? "VideoFile" : "file"}
                accept={modalType === 'VideoFile' ? "video/*" : "image/*"} 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {selectedFile && (
              <div style={{ 
                padding: '10px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px'
              }}>
                <p style={{ margin: 0, color: '#c71b29' }}>
                  <strong style={{ color: '#666' }}><span>Selected File:</span></strong> {selectedFile.name}
                  <br />
                  <strong style={{ color: '#666' }}><span>Size:</span> </strong>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {currentImage && modalType !== 'VideoFile' && (
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ marginBottom: '10px' }}>Current:</h4>
                <img 
                  src={currentImage} 
                  alt="Current" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }} 
                />
              </div>
            )}

            {currentImage && modalType === 'VideoFile' && (
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ marginBottom: '10px' }}>Current Video:</h4>
                <video 
                  controls 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <source src={currentImage} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px'
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: 'none',
                  background: selectedFile ? '#c71b29' : '#ccc',
                  color: 'white',
                  cursor: selectedFile ? 'pointer' : 'not-allowed'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <Topnav />
      <Header /> */}
      <Container>
        <div className="profile-card">
          {/* <Title>Agent Musician By <span1>{userDetails?.username}</span1></Title> */}
           <SubTitle>MUSICIANS ({count})</SubTitle>

          {agentMusicians.map(musician => (
            <div key={musician.id} className="model-section">
              <div className='profile'>
                <div className="profile-info left">
                  <div className="profile-pic">
                    <img src={`${API_URL}${musician?.Poster[0]?.url || ''}`} alt="Profile" />
                  </div>
                  <div className="profile-details">
                    {editingMusicianId !== musician.id ? (
                      <>
                        <h2 className="name">{musician?.Name}</h2>
                        <p className="bio"><span>Age: {musician?.Age}</span></p>
                        <p className="bio"><span>Musical Geners: {musician?.MusicalGeners}</span></p>
                         <p className="bio"><span>CanReadMusic: {musician?.CanReadMusic}</span></p>
                          <p className="bio"><span>Band Exp: {musician?.BandExperience}</span></p>
                            <p className="bio"><span>Trained In: {musician?.FormalTraining}</span></p>
                            <p className="bio"><span>Year of Exp: {musician?.Yearofexperience}</span></p>
                        <p className="bio">{musician?.Description}</p>
                        <button className="edit-button" onClick={() => toggleEditing(musician.id)}>
                          Edit Profile
                        </button>
                      </>
                    ) : (
                      <div className="edit-form">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            name="Name"
                            value={formData[musician.id]?.Name || ''}
                            onChange={(e) => handleInputChange(e, musician.id)}
                          />
                        </div>
                         <div className="form-group">
                        <label>Primary Instrument</label>
                        <input
                          type="text"
                          name="PrimaryInstrument"
                           value={formData[musician.id]?.PrimaryInstrument || ''}
                            onChange={(e) => handleInputChange(e, musician.id)}
                          />
                      </div>
                        <div className="TwoField">
                          <div className="form-group">
                            <label>Musical Genener</label>
                            <input
                               type="text"
                          name="MusicalGeners"
                              value={formData[musician.id]?.MusicalGeners || ''}
                              onChange={(e) => handleInputChange(e, musician.id)}
                            />
                          </div>
                          <div className="form-group">
                             <label>Band Experience</label>
                        <input
                          type="text"
                          name="BandExperience"
                              value={formData[musician.id]?.BandExperience || ''}
                              onChange={(e) => handleInputChange(e, musician.id)}
                            />
                          </div>
                        </div>
                          <div className="TwoField">
                          <div className="form-group">
                            <label>Formal Training</label>
                            <input
                               type="text"
                          name="FormalTraining"
                              value={formData[musician.id]?.FormalTraining || ''}
                              onChange={(e) => handleInputChange(e, musician.id)}
                            />
                          </div>
                          <div className="form-group">
                             <label>Can Read Music</label>
                        <input
                          type="text"
                          name="CanReadMusic"
                              value={formData[musician.id]?.CanReadMusic || ''}
                              onChange={(e) => handleInputChange(e, musician.id)}
                            />
                          </div>
                        </div>
                 
                        <div className="TwoField">
                        <div className="form-group">
                            <label>Age</label>
                            <input
                               type="text"
                          name="Age"
                              value={formData[musician.id]?.Age || ''}
                              onChange={(e) => handleInputChange(e, musician.id)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Year of Exp</label>
                        <input
                          type="text"
                          name="Yearofexperience"
                              value={formData[musician.id]?.Yearofexperience || ''}
                              onChange={(e) => handleInputChange(e, musician.id)}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            type="text"
                            name="Description"
                            rows={4}
                            value={formData[musician.id]?.Description || ''}
                            onChange={(e) => handleInputChange(e, musician.id)}
                          />
                        </div>
                        <button className="save-button" onClick={() => saveMusician(musician.id)}>
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='right'>
                  <div className='right-up'>
                    <div className='r1'>
                      <h2 className="gallery-title">Poster</h2>
                      <div className="gallery-item gallery1">
                        <img 
                          src={musician?.Poster[0]?.url ? `${API_URL}${musician.Poster[0].url}` : 'https://api.moviemads.com/uploads/empty_image_dd70f20899.jpg'} 
                          alt="Musician Poster" 
                          className="gallery-image" 
                        />
                        <button 
                          className="edit-Pic" 
                          onClick={() => openModal('Poster', musician.id,musician?.Poster[0]?.url ? `${API_URL}${musician?.Poster[0]?.url}` : '')}
                        >
                          Change Poster
                        </button>
                      </div>
                    </div>

                    <div className='r1'>
                      <h2 className="gallery-title">Thumbnail</h2>
                      <div className="gallery-item gallery1">
                        <img 
                          src={musician?.Thumbnail[0]?.url ? `${API_URL}${musician?.Thumbnail[0]?.url}` : 'https://api.moviemads.com/uploads/empty_image_dd70f20899.jpg'} 
                          alt="Musician Thumbnail" 
                          className="gallery-image" 
                        />
                        <button 
                          className="edit-Pic" 
                          onClick={() => openModal('Thumbnail', musician.id, musician?.Thumbnail[0]?.url ? `${API_URL}${musician?.Thumbnail[0]?.url}` : '')}
                        >
                          Change Thumbnail
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className='r2'>
                    <h2 className="gallery-title">Images</h2>
                    <div className="gallery1">
                      {[...Array(5)].map((_, index) => {
                        const image = musician?.Images?.[index];
                        return (
                          <div key={index} className="gallery-item">
                            <img 
                              src={image ? `${API_URL}${image.url}` : 'https://api.moviemads.com/uploads/empty_image_dd70f20899.jpg'} 
                              alt={`Musician ${index}`} 
                              className="gallery-image" 
                            />
                            <button 
                              className="edit-Pic" 
                              onClick={() => openModal('Images', musician.id, image ? `${API_URL}${image.url}` : '', image?.id)}
                            >
                              Change Image
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    gap: '16px',
                    margin: '20px 0'
                  }}>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      marginBottom: '10px',
                      textAlign: 'center'
                    }}>Video</h2>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      gap: '16px',
                      width: '100%'
                    }}>
                      <video 
                        style={{ 
                          width: '100%',
                          maxWidth: '500px',
                          height: '300px',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          display: musician?.VideoFile?.[0] ? 'block' : 'none'
                        }} 
                        controls 
                        autoPlay 
                        loop
                        key={musician?.VideoFile?.[0]?.id || 'no-video'}
                      >
                        {musician?.VideoFile?.[0] && (
                          <source
                            src={`${API_URL}${musician.VideoFile[0].url}?t=${new Date().getTime()}`}
                            type="video/mp4"
                          />
                        )}
                        Your browser does not support the video tag.
                      </video>
                      
                      {!musician?.VideoFile?.[0] && (
                        <p style={{ color: '#666' }}>No video available</p>
                      )}
                      
                      <button 
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#ff0015',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                        onClick={() => openModal('VideoFile', musician.id, musician?.VideoFile?.[0]?.url ? `${API_URL}${musician.VideoFile[0].url}` : '')}
                      >
                        {musician?.VideoFile?.[0] ? 'Change Video' : 'Upload Video'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {isModalOpen && (
          <ProfileModal closeModal={() => setIsModalOpen(false)} />
        )}
      </Container>
      {/* <Footer /> */}
    </>
  );
};

export default AgentEditMusician;
export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  span1{
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 30px;
    color:red;
  }
`;
const SubTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0;
  color: #333;
  border-bottom: 2px solid #c71b29;
  padding-bottom: 8px;
`;
const Container = styled.main`
  min-height: calc(100vh - 70px);
  padding: 0 calc(3.5vw + 5px);
  position: relative;
  padding-bottom: 50px;
  overflow-x: hidden;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;