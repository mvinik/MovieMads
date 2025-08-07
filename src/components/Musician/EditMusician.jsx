import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer/Footer'
import Topnav from '../TopNav/Topnav'
import { message } from 'antd';
import './Musician.css'
import { PlusOutlined } from '@ant-design/icons'
const EditMusician = () => {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [imageId, setImageId] = useState("");
  const [videoId, setVideoId] = useState("");
  const [posterId, setPosterId] = useState("");
  const [thumbnailId, setThumbnailId] = useState("");
  const [details, setDetails] = useState(null);
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [musicalGener, setMusicalGener] = useState("");
  const [yearofexperience, setYearofexperience] = useState("");
  const [poster, setPoster] = useState(null);
  const [videoFile, setVideoFile] = useState(null)
  const [multipleImage, setMultipleImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [primaryInstrument, setPrimaryInstrument] = useState("");
  const [formalTraining, setFormalTraining] = useState("");
  const [canReadMusic, setCanReadMusic] = useState("");
  const [performanceExperience, setPerformanceExperience] = useState("");
  const [performanceType, setPerformanceType] = useState("");
  const [bandExperience, setBandExperience] = useState("");
  const fileInputRef = React.useRef(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "description":
        setDescription(value);
        break;
        case "age":
        setAge(value);
        break;
      case "musicalGener":
        setMusicalGener(value);
        break;
      case "yearofexperience":
        setYearofexperience(value);
        break;
      case "primaryInstrument":
        setPrimaryInstrument(value);
        break;
      case "formalTraining":
        setFormalTraining(value);
        break;
      case "performanceExperience":
        setPerformanceExperience(value);
        break;
        case "performanceType":
        setPerformanceType(value);
        break;
        case "CanReadMusic":
        setCanReadMusic(value);
        break;
      case "bandExperience":
        setBandExperience(value);
        break;
      default:
        break;
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/Musicians/${id}?populate=*`
      );
      const responseData = response.data.data;
      setDetails(responseData);
      setFullName(responseData?.attributes?.Name);
      setDescription(responseData?.attributes?.Description);
      setAge(responseData?.attributes?.Age);
      setMusicalGener(responseData?.attributes?.MusicalGeners);
      setBandExperience(responseData?.attributes?.BandExperience);
         setCanReadMusic(responseData?.attributes?.CanReadMusic);
            setPrimaryInstrument(responseData?.attributes?.PrimaryInstrument);
               setFormalTraining(responseData?.attributes?.FormalTraining);
          
                     setPerformanceType(responseData?.attributes?.PerformanceType);
      setYearofexperience(responseData?.attributes.Yearofexperience);
      setPosterId(responseData?.attributes?.Poster?.data[0]?.id);
      // setVideoId(responseData?.attributes?.VideoFile?.data?.id)
      // Set the first video as the primary one (or implement your own logic)
    const firstVideo = responseData?.attributes?.VideoFile?.data?.[0];
    setVideoId(firstVideo?.id);
      setThumbnailId(responseData?.attributes?.Thumbnail?.data[0]?.id);
      console.log(responseData, 'Edit response');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldChange = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/Musicians/${id}`, {
        data: {
          Name: fullName,
          Description: description,
            Age:age,
          MusicalGeners:musicalGener,
          Yearofexperience: yearofexperience,
             PrimaryInstrument:primaryInstrument,
          FormalTraining:formalTraining,
          PerformanceExperience:performanceExperience,
          PerformanceType:performanceType,
          CanReadMusic:canReadMusic,
          BandExperience:bandExperience,
         
        }
      });
      // console.log(res.data,'edited response')
      toggleEditing();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  const handleFileChange = (e, index) => {
    const { name, files, videofile } = e.target;
    //console.log(`File selected for ${name}:`, files[0]);

    switch (name) {
      case "poster":
        // console.log("Setting poster:", files[0]);
        setPoster(files[0]);
        break;
      case "thumbnail":
        // console.log("Setting thumbnail:", files[0]);
        setThumbnail(files[0]);
        break;
      case "VideoFile":
        // console.log("Setting thumbnail:", files[0]);

        setVideoFile(files[0]);
        break;
      case "images":
        setImages(prevImages => {
          const newImages = [...prevImages];
          newImages[index] = files[0];

          // console.log("Setting images:", newImages);
          return newImages;
        });
        break;
      default:
        break;
    }
  };



  const handlePosterUpload = async (img) => {

    try {
      const formData = new FormData();
      formData.append('files', img);
      const newFileData = {
        alternativeText: " ",
        name: " ",
        caption: 'Poster',
      };
      formData.append('fileInfo', JSON.stringify(newFileData));

      const res = await axios.post(`${API_URL}/api/upload?id=${posterId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json'
        }
      });
      fetchData(); // Refresh data after upload
      setIsModalOpen(false); // Close the modal after upload
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };


  const handleThumbnailUpload = async (img) => {
    try {
      const formData = new FormData();
      formData.append('files', img);
      const newFileData = {
        alternativeText: " ",
        name: " ",
        caption: 'Thumbnail',
      };
      formData.append('fileInfo', JSON.stringify(newFileData));

      const res = await axios.post(`${API_URL}/api/upload?id=${thumbnailId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json'
        }
      });
      fetchData(); // Refresh data after upload
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

const handleVideoFileUpload = async (video) => {
  if (!video) {
    console.error('No video file selected');
      message.error('Video file too large (max 50MB)');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('files', video);
    
    const newFileData = {
      alternativeText: details?.attributes?.Name || "Musician Video",
      caption: 'Musician Video File',
    };
    formData.append('fileInfo', JSON.stringify(newFileData));

    let response;
    
    // If updating existing video
    if (videoId) {
      response = await axios.post(`${API_URL}/api/upload?id=${videoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } 
    // If adding new video
    else {
      formData.append('refId', id);
      formData.append('ref', 'api::musician.musician');
      formData.append('field', 'VideoFile');
      
      response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
  message.success('Video uploaded successfully!');
    
    // Force a cache-busting reload
    const timestamp = new Date().getTime();
    window.location.href = `${window.location.pathname}?t=${timestamp}`;
     
  } catch (error) {
    console.error('Video upload error:', error);
    // alert('Error uploading video. Please try again.');
      message.error('Failed to upload video');
  }
};

  const handleImagesUpload = async (img) => {
    try {
      const formData = new FormData();
      formData.append('files', img);
      const newFileData = {
        alternativeText: " ",
        name: " ",
        caption: 'Images',
      };
      formData.append('fileInfo', JSON.stringify(newFileData));

      if (imageId) {
        // Replace existing image
        // console.log('OLD Image Check')
        const res = await axios.post(`${API_URL}/api/upload?id=${imageId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json'
          }
        });
        window.location.reload();
        // console.log(res.data, 'image update response');
      }else{
        // console.log('new Image Check')
        const newImageData = new FormData();
        newImageData.append('files', img);
        newImageData.append('field', 'Images');
        const newFileData = {
          alternativeText: " ",
          name: " ",
          caption: 'Images',
        };
        newImageData.append('fileInfo', JSON.stringify(newFileData));
        newImageData.append('refId', localStorage.getItem('MusicianId'));
        newImageData.append('ref', 'api::musician.musician');
        // Upload new image
        const res = await axios.post(`${API_URL}/api/upload`, newImageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json'
          }
        });
        window.location.reload();
        // console.log(localStorage.getItem('MusicianId'),res.data, 'new image upload response');
      }
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSvgClick = () => {
    fileInputRef.current.click();
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const deleteOldVideos = async () => {
  try {
    const videos = details?.attributes?.VideoFile?.data;
    
    // Delete all except the first video
    for (let i = 1; i < videos.length; i++) {
      await axios.delete(`${API_URL}/api/upload/files/${videos[i].id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('JwtToken')}` }
      });
    }
    
    fetchData();
    alert('Old videos cleaned up!');
  } catch (error) {
    console.error('Error deleting videos:', error);
  }
};
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: '#c71b29',
        padding: '20px',
        borderRadius: '10px',
        cursor: 'pointer', // Ensure the button is clickable
      }}
      type="button"
      onClick={handleSvgClick}
    >
      <PlusOutlined style={{ color: 'white' }} />
      <div
        style={{
          marginTop: 8,
          color: '#fff', // Ensure text is visible
        }}
      >
        Upload More
      </div>
    </button>
  );

  return (
    <>
      <Topnav />
      <Header />
      <Container>
        <div className="profile-card">
          <h1 className="title">Profile Page</h1>

          <div className='profile'>
            <div className="profile-info left">
              <div className="profile-pic">
                <img src={`${API_URL}${details?.attributes?.Poster?.data[0]?.attributes?.url}`} alt="Profile" />
              </div>
              <div className="profile-details">
                {!editing ? (
                  <>
                    <h2 className="name">{details?.attributes?.Name}</h2>
                    {/* <p className="email">{details?.attributes.Email}</p> */}
                    <p className="bio"><span>Age: {details?.attributes?.Age}</span></p>
                       <p className="bio"><span>Primary Instrument: {details?.attributes?.PrimaryInstrument}</span></p>
                    <p className="bio"><span>Musical Geners: {details?.attributes?.MusicalGeners}</span></p>
                      {/* <p className="bio"><span>Performance Type: {details?.attributes?.PerformanceType}</span></p> */}
                        <p className="bio"><span>CanReadMusic: {details?.attributes?.CanReadMusic}</span></p>
                          <p className="bio"><span>Band Exp: {details?.attributes?.BandExperience}</span></p>
                            <p className="bio"><span>Trained In: {details?.attributes?.FormalTraining}</span></p>
                            <p className="bio"><span>Year of Exp: {details?.attributes.Yearofexperience}</span></p>
                    <p className="bio">{details?.attributes?.Description}</p>
                    <button className="edit-button" onClick={toggleEditing}>
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="TwoField">
                      <div className="form-group">
                        <label>Age</label>
                        <input
                          type="text"
                          name="age"
                          value={age}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Year of Exp</label>
                        <input
                          type="text"
                          name="yearofexperience"
                          value={yearofexperience}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="TwoField">
                       <div className="form-group">
                        <label>Primary Instrument</label>
                        <input
                          type="text"
                          name="primaryInstrument"
                          value={primaryInstrument}
                          onChange={handleInputChange}
                        />
                      </div>
                             <div className="form-group">
                        <label>Musical Genener</label>
                        <input
                          type="text"
                          name="musicalGener"
                          value={musicalGener}
                          onChange={handleInputChange}
                        />
                      </div>
                     
                    </div>

                     <div className="TwoField">
                       <div className="form-group">
                        <label>Band Experience</label>
                        <input
                          type="text"
                          name="bandExperience"
                          value={bandExperience}
                          onChange={handleInputChange}
                        />
                      </div>
                             <div className="form-group">
                        <label>Formal Training</label>
                        <input
                          type="text"
                          name="formalTraining"
                          value={formalTraining}
                          onChange={handleInputChange}
                        />
                      </div>
                     
                    </div>
                      <div className="TwoField">
                       <div className="form-group">
                        <label>Can Read Music</label>
                        <input
                          type="text"
                          name="canReadMusic"
                          value={canReadMusic}
                          onChange={handleInputChange}
                        />
                      </div>
                           <div className="form-group">
                        <label>Performance Type</label>
                        <input
                          type="text"
                          name="performanceType"
                          value={performanceType}
                          onChange={handleInputChange}
                        />
                      </div> 
                     
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        type="text"
                        name="description"
                        rows={4}
                        value={description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button className="save-button" onClick={handleFieldChange}>
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
                    <img src={`${API_URL}${details?.attributes?.Poster?.data[0]?.attributes?.url}`} alt={`Musicianl Image`} className="gallery-image" />
                    <button className="edit-Pic" onClick={() => setIsModalOpen('poster')}>
                      Change Poster
                    </button>
                  </div>
                </div>

                <div className='r1'>
                  <h2 className="gallery-title">Thumbnail</h2>
                  <div className="gallery-item gallery1">
                    <img src={`${API_URL}${details?.attributes?.Thumbnail?.data[0]?.attributes?.url}`} alt={`Musician Image`} className="gallery-image" />
                    <button className="edit-Pic" onClick={() => setIsModalOpen('thumbnail')}>
                      Change Thumbnail
                    </button>
                  </div>
                </div>
              </div>
              <div className='r2'>
                <h2 className="gallery-title">Images</h2>

                <div className="gallery1">
                  {[...Array(5)].map((_, index) => {
                    const image = details?.attributes?.Images?.data?.[index];
                    const fileInputId = `fileInput_${index}`;

                    return (
                      <div key={index} className="gallery-item">
                        {image ? (
                          <>
                            <img src={`${API_URL}${image?.attributes?.url}`} alt={`Musician ${index}`} className="gallery-image" />
                            <button className="edit-Pic" onClick={() => { setIsModalOpen('Images'); setMultipleImage(`${API_URL}${image?.attributes?.url}`); setImageId(`${image.id}`) }}>
                              Change Image
                            </button>
                          </>
                        ) : (
                          <div className="gallery-item">
                            <img src={`https://api.moviemads.com/uploads/empty_image_dd70f20899.jpg`} alt={`Musician `} className="gallery-image" />
                            <button className="edit-Pic" onClick={() => { setIsModalOpen('Images'); }}>
                              Change Image
                            </button>
                          </div>
                        )}
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
    display: details?.attributes?.VideoFile?.data?.[0] ? 'block' : 'none'
  }} 
  controls 
  autoPlay 
  loop
  key={details?.attributes?.VideoFile?.data?.[0]?.id || 'no-video'} // Add key to force re-render
>
  {details?.attributes?.VideoFile?.data?.[0] && (
    <source
      src={`${API_URL}${details?.attributes?.VideoFile?.data[0]?.attributes?.url}?t=${new Date().getTime()}`}
      type="video/mp4"
    />
  )}
  Your browser does not support the video tag.
</video>
    
    {!details?.attributes?.VideoFile?.data?.[0] && (
      <p style={{ color: '#666' }}>No video available</p>
    )}
    
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'start',
      width: '100%'
    }}>
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
        onClick={() => setIsModalOpen('VideoFile')}
      >
        {details?.attributes?.VideoFile?.data?.[0] ? 'Change Video' : 'Upload Video'}
      </button>
      
      {details?.attributes?.VideoFile?.data?.length > 1 && (
        <button 
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
          onClick={deleteOldVideos}
        >
          Clean Up Old Videos
        </button>
      )}
    </div>
  </div>
</div>

            </div>
          </div>
        </div>
        {isModalOpen && (
          <ProfileModal
            closeModal={toggleModal}
            handleFileChange={handleFileChange}
            handleImageUpload={handlePosterUpload}
            // currentImage={`${API_URL}${details?.attributes?.Poster?.data[0]?.attributes?.url}`}
            handleSvgClick={handleSvgClick}
            fileInputRef={fileInputRef}
          />
        )}

        {isModalOpen === 'thumbnail' && (
          <ProfileModal
            closeModal={() => setIsModalOpen(false)}
            handleFileChange={handleFileChange}
            handleImageUpload={handleThumbnailUpload}
            // currentImage={`${API_URL}${details?.attributes?.Thumbnail?.data[0]?.attributes?.url}`}
            handleSvgClick={handleSvgClick}
            fileInputRef={fileInputRef}
          />
        )}
        {isModalOpen === 'Images' && (
          <ProfileModal
            closeModal={() => setIsModalOpen(false)}
            handleFileChange={handleFileChange}
            handleImageUpload={handleImagesUpload}
            // currentImage={multipleImage}
            handleSvgClick={handleSvgClick}
            fileInputRef={fileInputRef}
          />
        )}
      {isModalOpen === 'VideoFile' && (
  <ProfileModal
    closeModal={() => setIsModalOpen(false)}
    handleFileChange={handleFileChange}
    handleImageUpload={handleVideoFileUpload}
    // currentImage={
    //   details?.attributes?.VideoFile?.data?.[0]?.attributes?.url
    //     ? `${API_URL}${details.attributes.VideoFile.data[0].attributes.url}`
    //     : null
    // }
    handleSvgClick={handleSvgClick}
    fileInputRef={fileInputRef}
    isVideo={true}
  />
)}
      </Container>
      <Footer />
      {/* Modal for changing profile picture */}
    </>
  )
}

const ProfileModal = ({
  closeModal,
  handleFileChange,
  handleSvgClick,
  fileInputRef,
  handleImageUpload,
  currentImage,
  isVideo = false
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Additional validation for video files
      if (isVideo) {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        if (!validTypes.includes(file.type)) {
          alert('Please upload a valid video file (MP4, MOV, AVI)');
          return;
        }
      }
      setSelectedFile(file);
    }
  };

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
          Change {isVideo ? 'Video' : 'Image'}
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {/* File Upload Area */}
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
              Click to select {isVideo ? 'a video file' : 'an image'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              name={isVideo ? "VideoFile" : "file"}
              accept={isVideo ? "video/*" : "image/*"}
              onChange={handleFileSelected}
              style={{ display: 'none' }}
            />
          </div>

          {/* Selected File Info */}
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

          {/* Preview Area */}
          {currentImage && !isVideo && (
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

          {currentImage && isVideo && (
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

          {/* Action Buttons */}
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
              onClick={() => handleImageUpload(selectedFile)}
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

export default EditMusician;

const Container = styled.main`
  min-height: calc(100vh - 70px);
  padding: 0 calc(3.5vw + 5px);
  position: relative;
  padding-bottom: 50px;
  overflow-x: hidden;
  &:before {
    // background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;