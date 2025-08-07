import React, { useState, useEffect } from 'react';
import { Steps, Form, Input, ConfigProvider, Button, Upload, message, Progress, Select, notification } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from "styled-components";
import '../Contest/Contest.css'
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import Modal from 'antd/es/modal/Modal';
import Topnav from '../TopNav/Topnav';
import Header from '../Header';

const { Step } = Steps;
const Token = localStorage.getItem("JwtToken");

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const API_URL = process.env.REACT_APP_API_URL;

const FilmUpload = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [videoUpload, setVideoUpload] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUpload1, setImageUpload1] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewVideo, setPreviewVideo] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [yourName, setYourName] = useState("");
  const [mobile, setMobile] = useState("");
  const [movieName, setMovieName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [actorName, setActorName] = useState("");
  const [actressName, setActressName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [contentRating, setContentRating] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);
  const [fileSizeError1, setFileSizeError1] = useState(false);
  const [fileSizeError2, setFileSizeError2] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    poster: false,
    thumbnail: false,
    movie: false
  });

//   const ShowModal = () => {
//     setShowModal(true);
//   };

//   const handleClose = () => {
//     setShowModal(false);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowModal(true);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "yourName":
        setYourName(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "movieName":
        setMovieName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "language":
        setLanguage(value);
        break;
      case "genre":
        setGenre(value);
        break;
      case "actorName":
        setActorName(value);
        break;
      case "actressName":
        setActressName(value);
        break;
      case "directorName":
        setDirectorName(value);
        break;
      case "contentRating":
        setContentRating(value);
        break;
      case "duration":
        setDuration(value);
        break;
      case "profile":
        setProfile(value);
        break;
      default:
        break;
    }
  };
const option1 = {
  headers: {
    'Authorization': `Bearer ${Token}`,
    'Content-Type': 'application/json'
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/shortfilm-uploads`, {
        data: {
          UserName: values.yourName,
          MobileNumber: values.mobile,
          MovieName: values.movieName,
          Description: values.description,
          Language: values.language,
          Genres: values.genre,
          Actors: values.actorName,
          Actress: values.actressName,
          Directors: values.directorName,
          contentRating: values.contentRating,
          Duration: values.duration,
          Profile: values.profile,
          users_permissions_user: localStorage.getItem('UserId'),
          Email: localStorage.getItem('EmailId'),
        }
      }, option1);
      const formId = response.data.data.id;
      localStorage.setItem("formId", formId);
      setCurrentStep(currentStep + 1);
      setLoading(false);
    }
catch (err) {
  console.error("Full error object:", err);
  console.error("Request config:", err.config);
  if (err.response) {
    console.error("Response data:", err.response.data);
    console.error("Response status:", err.response.status);
    console.error("Response headers:", err.response.headers);
    
    notification.error({
      message: `Upload Error (${err.response.status})`,
      description: err.response.data.error?.message || 
                  JSON.stringify(err.response.data) || 
                  'Something went wrong',
      placement: 'top',
    });
  } else if (err.request) {
    console.error("Request:", err.request);
    notification.error({
      message: 'Network Error',
      description: 'No response received from server',
      placement: 'top',
    });
  } else {
    console.error('Error:', err.message);
    notification.error({
      message: 'Application Error',
      description: err.message,
      placement: 'top',
    });
  }
  setLoading(false);
}

  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
    setPreviewVisible(true);
  };

  const handleVideoUpload = (file) => {
    const MAX_FILE_SIZE = 1500 * 1024 * 1024;
    try {
      if (!file || !file.file || !file.file.originFileObj) {
        return;
      }
      if (file.file.originFileObj.size > MAX_FILE_SIZE) {
        console.error('Error: File size exceeds the maximum limit.');
        return;
      }

      setVideoUpload(file.file.originFileObj);
      setUploadProgress(prevState => ({ ...prevState, movie: file.percent }));
      setUploadStatus(prevStatus => ({ ...prevStatus, movie: true }));
    } catch (error) {
      console.error('Error handling video upload:', error);
    }
  };

  const handleImageUpload = (file) => {
    const MAX_FILE_SIZE = 3 * 1024 * 1024;
    try {
      if (!file || !file.file || !file.file.originFileObj) {
        return;
      }
      if (file.file.originFileObj.size > MAX_FILE_SIZE) {
        console.error('Error: File size exceeds the maximum limit.');
        return;
      }

      setImageUpload(file.file.originFileObj);
      setUploadProgress(prevState => ({ ...prevState, poster: file.percent }));
      setUploadStatus(prevStatus => ({ ...prevStatus, poster: true }));
    } catch (error) {
      console.error('Error handling image upload:', error);
    }
  };

  const handleImageUpload1 = (file) => {
    const MAX_FILE_SIZE = 7 * 1024 * 1024;
    try {
      if (!file || !file.file || !file.file.originFileObj) {
        return;
      }
      if (file.file.originFileObj.size > MAX_FILE_SIZE) {
        console.error('Error: File size exceeds the maximum limit.');
        return;
      }

      setImageUpload1(file.file.originFileObj);
      setUploadProgress(prevState => ({ ...prevState, thumbnail: file.percent }));
      setUploadStatus(prevStatus => ({ ...prevStatus, thumbnail: true }));
    } catch (error) {
      console.error('Error handling image upload:', error);
    }
  };

  useEffect(() => {
    if (uploadStatus.movie && uploadStatus.thumbnail && uploadStatus.poster) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [uploadStatus]);

  const calculateOverallProgress = () => {
    const { poster, thumbnail, movie } = uploadProgress;
    if (poster !== undefined && thumbnail !== undefined && movie !== undefined) {
      const overallProgress = movie;
      const overallProgresss = Math.round(overallProgress);
      return overallProgresss;
    }
    return 0;
  };

  const handleUpload = async () => {
    setUploading(true);
    const videoSize = videoUpload.size;
    let uploadedBytes = 0;

    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => {
        const progress = Math.min(uploadedBytes / videoSize * 100, 100);
        setUploadProgress({
          poster: progress,
          thumbnail: progress,
          movie: progress,
        });
      }, i * 100);
    }

    const videoFormData = new FormData();
    const newFileData = {
      alternativeText: localStorage.getItem("formId"),
      caption: 'video',
    };
    videoFormData.append('fileInfo', JSON.stringify(newFileData));
    videoFormData.append('files', videoUpload);
    videoFormData.append('refId', localStorage.getItem("formId"))
    videoFormData.append('ref', 'api::shortfilm-upload.shortfilm-upload')
    videoFormData.append('field', "VideoFile")

    try {
      const videoResponse = await axios.post(`${API_URL}/api/upload`, videoFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Token}`,
        },
        onUploadProgress: progressEvent => {
          uploadedBytes = progressEvent.loaded;
          const progress = Math.min(uploadedBytes / videoSize * 100, 100);
          setUploadProgress({
            poster: progress,
            thumbnail: progress,
            movie: progress,
          });
        }
      });
    } catch (error) {
      console.error('Error uploading video:', error);
    }

    const imageFormDatas = [imageUpload, imageUpload1];

    for (let i = 0; i < imageFormDatas.length; i++) {
      const imageFormData = new FormData();
      imageFormData.append('files', imageFormDatas[i]);
      imageFormData.append('refId', localStorage.getItem("formId"))
      imageFormData.append('ref', 'api::shortfilm-upload.shortfilm-upload')

      if (i == 0) {
        imageFormData.append('field', "MoviePoster")
        const newFileData = {
          alternativeText: localStorage.getItem("formId"),
          caption: 'MoviePoster',
        };
        imageFormData.append('fileInfo', JSON.stringify(newFileData));
      }
      else {
        imageFormData.append('field', "MovieThumbnail")
        const newFileData = {
          alternativeText: localStorage.getItem("formId"),
          caption: 'Thumbnail',
        };
        imageFormData.append('fileInfo', JSON.stringify(newFileData));
      }

      try {
        const imageResponse = await axios.post(`${API_URL}/api/upload`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${Token}`,
          },
        });
      } catch (error) {
        console.error(`Error uploading Media ${i + 1}:`, error);
      } finally {
        setUploading(false);
      }
    }

    // Show success message and reset form
    message.success('Your short film has been uploaded successfully!');
    setCurrentStep(0);
    form.resetFields();
    setFileList([]);
    setVideoUpload(null);
    setImageUpload(null);
    setImageUpload1(null);
    setUploadProgress(0);
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const validateWordCount = (_, value) => {
    if (value) {
      const words = value.trim().split(/\s+/);
      if (words.length > 200) {
        return Promise.reject(new Error('Description cannot exceed 200 words!'));
      }
    }
    return Promise.resolve();
  };

  const validateDuration = (_, value) => {
    if (value > 7) {
      return Promise.reject('Duration cannot exceed 7 minutes!');
    }
    else if (value < 3) {
      return Promise.reject('Duration cannot be less than 3 minutes!')
    }
    return Promise.resolve();
  };



  return (
    <>
      <Topnav />
      <Header />
      <Modal
        // open={showModal}  onCancel={handleClose}
        footer={null}
      >
        <VideoContainer>
          <img
            src='https://api.moviemads.com/uploads/Rules1_5554c18870.jpg'
            alt='Moviemads Invitation'
          />
          <img
            src='https://api.moviemads.com/uploads/Whats_App_Image_2024_08_16_at_18_00_35_3f74cab0_f8777d6bb1.jpg'
            alt='Moviemads Invitation'
          />
        </VideoContainer>
      </Modal>
      <div className="container">
        <h1 className='contest-heading'>Upload Short Film</h1>
        {loading ? (
          <div class="hourglassBackground">
            <div class="hourglassContainer">
              <div class="hourglassCurves"></div>
              <div class="hourglassCapTop"></div>
              <div class="hourglassGlassTop"></div>
              <div class="hourglassSand"></div>
              <div class="hourglassSandStream"></div>
              <div class="hourglassCapBottom"></div>
              <div class="hourglassGlass"></div>
            </div>
          </div>
        ) : (
          <div className="steps-container">
            {/* <button className='Rules-Btn' onClick={ShowModal}>View rules and regulations</button> */}
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#fba010',
                  colorText: '#ffffff',
                  colorIcon: '#ffffff',
                },
                components: {
                  Steps: {
                    colorPrimary: '#e50914',
                    algorithm: true,
                    colorText: '#ffffff',
                    colorTextTertiary: '#ffffff',
                    colorTextSecondary: '#ffffff',
                    navArrowColor: '#ffffff',
                  },
                  Button: {
                    colorPrimary: '#e50914',
                    algorithm: true,
                    colorBgContainerDisabled: '#495057',
                  },
                  Select: {
                    optionSelectedBg: '#e50914',
                    selectorBg: '#495057',
                    colorText: '#ffffff',
                    colorPrimary: '#fba010',
                    optionColor: '#212529',
                    colorBgElevated: '#212529',
                    colorBorder: '#495057',
                    borderRadiusLG: 0,
                  },
                  Form: {
                    colorPrimary: '#ffffff',
                    colorText: '#ffffff',
                    colorTextTertiary: '#ffffff',
                    colorTextSecondary: '#ffffff',
                    colorFillSecondary: '#ffffff',
                    algorithm: true,
                    labelColor: '#ffffff',
                  },
                  Typography: {
                    colorPrimary: '#ffffff',
                  },
                  Upload: {
                    colorText: '#ffffff',
                    colorIcon: '#ffffff',
                    colorPrimary: '#e50914',
                    colorFillAlter: 'rgba(251, 161, 16, 0.6)',
                    actionsColor: '#ffffff',
                  },
                  DatePicker: {
                    activeBg: '#212529',
                    colorBgContainer: '#495057',
                    colorText: '#ffffff',
                    colorBgElevated: '#212529',
                    colorPrimary: '#e50914',
                    colorBorder: '#495057',
                    borderRadius: 0,
                  },
                  Progress: {
                    defaultColor: '#fba010',
                    colorSuccess: '#e50914',
                    colorFillSecondary: '#303030',
                    fontSize: '36px',
                  },
                  TimePicker: {
                    colorBgContainer: '#495057',
                    colorText: '#ffffff',
                    colorBgElevated: '#212529',
                    colorPrimary: '#e50914',
                    colorBorder: '#495057',
                  },
                  Notification: {
                    colorBgElevated: '#212529',
                  },
                  Input: {
                    colorBgContainer: '#495057',
                    colorPrimary: '#fba010',
                    algorithm: true,
                    colorText: '#ffffff',
                    colorBorder: '#495057',
                    borderRadius: 0,
                  }
                },
              }}
            >
              <Steps current={currentStep}>
                <Step title="Details" />
                <Step title="Upload" />
              </Steps>
              <div style={{ marginTop: 30, color: "white" }}>
                {currentStep === 0 && (
                  <Form
                    form={form}
                    layout="vertical"
                    size="large"
                    className="form-container"
                  >
                    <div className='Two input'>
                      <Form.Item
                        label="Your Name"
                        name="yourName"
                        rules={[{ required: true, message: 'Please Enter Your Name!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Mobile Number"
                        name="mobile"
                        rules={[{ required: true, message: 'Please Enter Mobile Number!' }, { pattern: /^[0-9]{10}$/, message: 'Please Enter Valid Mobile Number!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                    <div className='Two input'>
                      <Form.Item
                        label="Movie Name"
                        name="movieName"
                        rules={[{ required: true, message: 'Please Enter the movie name!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Language"
                        name="language"
                        rules={[{ required: true, message: 'Please Select a Language!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Select>
                          <Select.Option value="Tamil">Tamil</Select.Option>
                          <Select.Option value="English">English</Select.Option>
                          <Select.Option value="Hindi">Hindi</Select.Option>
                          <Select.Option value="Telugu">Telugu</Select.Option>
                          <Select.Option value="Kannada">Kannada</Select.Option>
                          <Select.Option value="Malayalam">Malayalam</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='Two input'>
                      <Form.Item
                        label="Actor Name"
                        name="actorName"
                        rules={[{ required: true, message: 'Please Enter Actor Name!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Actress Name"
                        name="actressName"
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                    <div className='Two input'>
                      <Form.Item
                        label="Describe Your Short Film ( Max 200 words! )"
                        name="description"
                        rules={[
                          { required: true, message: 'Please describe your movie!' },
                          { validator: validateWordCount }
                        ]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <TextArea rows={6} />
                      </Form.Item>
                      <div className="input-container">
                        <Form.Item
                          label="Genre"
                          name="genre"
                          rules={[{ required: true, message: 'Please Select Genre!' }]}
                          className="input-container"
                          onChange={handleInputChange}
                        >
                          <Select>
                            <Select.Option value="Action">Action</Select.Option>
                            <Select.Option value="Adventure">Adventure</Select.Option>
                            <Select.Option value="Comedy">Comedy</Select.Option>
                            <Select.Option value="Drama">Drama</Select.Option>
                            <Select.Option value="Fantasy">Fantasy</Select.Option>
                            <Select.Option value="Horror">Horror</Select.Option>
                            <Select.Option value="Mystery">Mystery</Select.Option>
                            <Select.Option value="Romance">Romance</Select.Option>
                            <Select.Option value="Science fiction">Science fiction</Select.Option>
                            <Select.Option value="Sports">Sports</Select.Option>
                            <Select.Option value="Thriller">Thriller</Select.Option>
                            <Select.Option value="Documentary">Documentary</Select.Option>
                            <Select.Option value="Based on a True Story">Based on a True Story</Select.Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          label="Director Name"
                          name="directorName"
                          rules={[{ required: true, message: 'Please Enter Director name!' }]}
                          className="input-container"
                          onChange={handleInputChange}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    </div>
                    <div className='Two input'>
                      <Form.Item
                        label="Your Profile"
                        name="profile"
                        rules={[{ required: true, message: 'Please Select Your Profile!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Select>
                          <Select.Option value="Student">Student</Select.Option>
                          <Select.Option value="Employee">Employee</Select.Option>
                          <Select.Option value="Freelancer">Freelancer</Select.Option>
                          <Select.Option value="Business Owner">Business Owner</Select.Option>
                          <Select.Option value="Unemployed">Unemployed</Select.Option>
                          <Select.Option value="Homemaker">Homemaker</Select.Option>
                          <Select.Option value="Consultant">Consultant</Select.Option>
                          <Select.Option value="Entrepreneur">Entrepreneur</Select.Option>
                          <Select.Option value="Others">Others</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Content Rating"
                        name="contentRating"
                        rules={[{ required: true, message: 'Please Select Content Rating!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Select>
                          <Select.Option value="U">U (Universal)</Select.Option>
                          <Select.Option value="UA">U/A (Universal with Adult)</Select.Option>
                          <Select.Option value="A">A (Adult)</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Duration ( Maximum 7mins ! )"
                        name="duration"
                        rules={[{ required: true, message: 'Please Fill the Duration!' },
                        { validator: validateDuration }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input type='number' max={2} />
                      </Form.Item>
                    </div>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                        Next
                      </Button>
                    </Form.Item>
                  </Form>
                )}
                {currentStep === 1 && (
                  <Form>
                    <div >
                      <div className="upload-container">
                        <div style={{ marginBottom: '40px', textAlign: 'center', lineHeight: '5px' }}>
                          <h3>Upload Movie Poster </h3>
                          <h4>( 500 x 750 px)</h4>
                          <Form.Item
                            name="movie"
                            rules={[{ required: true, message: 'Please Upload the Movie' }]}
                            className="input-container"
                          >
                            <Upload
                              listType="picture-card"
                              onPreview={handlePreview}
                              onChange={handleImageUpload}
                              beforeUpload={(file) => {
                                const MAX_FILE_SIZE = 3 * 1024 * 1024;
                                if (file.size > MAX_FILE_SIZE) {
                                  message.error('File size exceeds the maximum limit of 3MB.');
                                  return Upload.LIST_IGNORE;
                                }
                                return true;
                              }}
                              maxCount={1}
                              withCredentials={false}
                              accept="image/*"
                            >
                              {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                          </Form.Item>
                          <span >( Maximum 3MB )</span>
                          <Modal open={previewOpen} title={previewTitle} visible={previewVisible} footer={null}
                            onCancel={handleCancel}
                          >
                            <img
                              alt="example"
                              style={{
                                width: '100%',
                              }}
                              src={previewImage}
                            />
                          </Modal >
                        </div>
                        <div style={{ marginBottom: '40px', textAlign: 'center', lineHeight: '5px' }}>
                          <h3>Upload Thumbnail </h3>
                          <h4>( 1280 x 720 px )</h4>
                          <Form.Item
                            name="movie"
                            rules={[{ required: true, message: 'Please Upload the Movie' }]}
                            className="input-container"
                          >
                            <Upload
                              listType="picture-card"
                              onPreview={handlePreview}
                              beforeUpload={(file) => {
                                const MAX_FILE_SIZE = 7 * 1024 * 1024;
                                if (file.size > MAX_FILE_SIZE) {
                                  message.error('File size exceeds the maximum limit of 7MB.');
                                  return Upload.LIST_IGNORE;
                                }
                                return true;
                              }}
                              onChange={handleImageUpload1}
                              maxCount={1}
                              accept="image/*"
                            >
                              {uploadButton}
                            </Upload>
                          </Form.Item>
                          <span >( Maximum 7MB )</span>
                          <Modal open={previewOpen} title={previewTitle} footer={null}
                            onCancel={handleCancel}
                            visible={previewVisible}
                          >
                            <img
                              alt="example"
                              style={{
                                width: '100%',
                              }}
                              src={previewImage}
                            />
                          </Modal>
                        </div>
                        <div style={{ marginBottom: '40px', textAlign: 'center', lineHeight: '5px' }}>
                          <h3>Upload Movie</h3>
                          <h4>( 1280 x 720 px )</h4>
                          <Form.Item
                            name="movie"
                            rules={[{ required: true, message: 'Please Upload the Movie' }]}
                            className="input-container"
                          >
                            <Upload
                              listType="picture-card"
                              onPreview={handlePreview}
                              beforeUpload={(file) => {
                                const MAX_FILE_SIZE = 1500 * 1024 * 1024;
                                if (file.size > MAX_FILE_SIZE) {
                                  message.error('File size exceeds the maximum limit of 1.5GB.');
                                  return Upload.LIST_IGNORE;
                                }
                                return true;
                              }}
                              onChange={handleVideoUpload}
                              maxCount={1}
                              accept="video/*"
                            >
                              {uploadButton}
                            </Upload>
                          </Form.Item>
                          {fileSizeError2 && <p className='SizeError'>Video size exceeds the limit</p>}
                          <span >( Maximum 1.5GB )</span>
                        </div>
                      </div>
                      <Progress percent={calculateOverallProgress()} />
                      <div style={{ marginTop: 40 }}>
                        <Button onClick={prevStep}>
                          <LeftOutlined /> Previous
                        </Button>
                        <Button 
                          type="primary" 
                          disabled={buttonDisabled || uploading}  
                          style={{ float: 'right' }} 
                          onClick={handleUpload}
                          loading={uploading}
                        >
                          {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </div>
            </ConfigProvider>
          </div>
        )}
      </div>
    </>
  )
}

export default FilmUpload;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  background: black;
  gap: 10px;
  overflow-y: scroll;
  height: 600px;
  border: 4px solid rgba(255, 0, 0, 0.315);

  img {
    object-fit: cover;
  }

  @media (max-width: 768px) {
    img {
      height: auto;
    }
  }
`;
