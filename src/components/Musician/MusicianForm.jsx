import React, { useState, useEffect } from 'react';
import { Steps, Form, Input, ConfigProvider, Button, Radio, Divider, Rate, Upload, Progress, Select, notification, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { message as antMessage } from 'antd';
// import {STRAPI_API_URL} from '../../constants.js';
import './Musician.css';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import Modal from 'antd/es/modal/Modal';
import Topnav from '../TopNav/Topnav';
import Header from '../Header';
const { Step } = Steps;
const API_URL = process.env.REACT_APP_API_URL;
const Token = localStorage.getItem("JwtToken");

const MusicianForm = () => {
  const [audioUpload, setAudioUpload] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("JwtToken"));
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [refCode, setRefCode] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [videoUpload, setVideoUpload] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUpload1, setImageUpload1] = useState(null);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [emailId, setEmailId] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [customGenre, setCustomGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [age, setAge] = useState("");
  const [musicalGener, setMusicalGener] = useState("");
  const [yearofexperience, setYearofexperience] = useState("");
  const [instaLink, setInstaLink] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [fileSizeError1, setFileSizeError1] = useState(false);
  const [fileSizeError2, setFileSizeError2] = useState(false);
  const [price, setPrice] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [finalPrice, setFinalPrice] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');
  const [primaryInstrument, setPrimaryInstrument] = useState("");
  const [formalTraining, setFormalTraining] = useState("");
  const [canReadMusic, setCanReadMusic] = useState("");
  const [performanceExperience, setPerformanceExperience] = useState("");
  const [performanceType, setPerformanceType] = useState("");
  const [bandExperience, setBandExperience] = useState("");

  const [uploadStatus, setUploadStatus] = useState({
    poster: false,
    thumbnail: false,
    images: false
  });

    const option1 = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  };
  
  const getAmount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/price?populate=*`)
      setPrice(res?.data?.data?.attributes?.ModelPrice);
      console.log(res,'amount')
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getAmount();
  }, [])

  useEffect(() => {
  setFinalPrice(price);
}, [price]);
console.log('price:', price);
console.log('finalPrice:', finalPrice);
  
  const applyCoupon = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/apply-coupon`, {
        code: coupon,
        originalPrice: price,
      });

      if (response.data.valid) {
        setDiscount(response.data.discount);
        setFinalPrice(response.data.finalPrice);
        setMessage(`Coupon applied! ₹${response.data.discount} off`);
      }
    } catch (error) {
      // Try to extract a string message, or fall back to a default
      const errorMsg = error.response?.data?.error?.message || 'Invalid or expired coupon';
      setMessage(errorMsg);
      setDiscount(0);
      setFinalPrice(price);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "emailId":
        setEmailId(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "language":
        setLanguage(value);
        break;
      case "category":
        setCategory(value);
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
      case "instaLink":
        setInstaLink(value);
        break;
      case "refcode":
        setRefCode(value);
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
        case "canReadMusic":
        setCanReadMusic(value);
        break;
      case "bandExperience":
        setBandExperience(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const values = await form.validateFields();
        console.log("Submitting data:", values); // Verify all fields 
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/musicians`, {
        data: {
          Name: values.fullName,
          MobileNumber: values.mobile,
          Email: values.emailId,
          Language: values.language,
          Category: values.category,
          Age: values.age,
          MusicalGeners: values.musicalGenre.join(','),
          Description: values.description,
          Yearofexperience: values.yearofexperience,
          Social: values.instaLink,
          referral_code: values.refcode,
          PrimaryInstrument:values.primaryInstrument,
          FormalTraining:values.formalTraining,
          PerformanceExperience:values.performanceExperience,
          PerformanceType:values.performanceType,
          CanReadMusic:values.canReadMusic,
          BandExperience:values.bandExperience,
          users_permissions_user: localStorage.getItem('UserId'),
          Musician_ID: null,
          publishedAt: null
        }
      });
        console.log("Response:", response.data); // Check Strapi's response
      const MusicianId = response.data.data.id;
      localStorage.setItem("MusicianId", MusicianId);
      console.log(MusicianId, 'MusicianId');
      setCurrentStep(currentStep + 1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        notification.error({
          message: 'Upload Error',
          description: 'Server responded with an error',
          placement: 'top'
        });
      } else if (err.request) {
        notification.error({
          message: 'Network Error',
          description: 'No response received from server. Please check your network connection.',
          placement: 'top'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        notification.error({
          message: 'Upload Error',
          description: 'Fill all the required fields',
          placement: 'top'
        });
      }
    }
  }

  const validateWordCount = (_, value) => {
    if (value) {
      const words = value.trim().split(/\s+/);
      if (words.length > 200) {
        return Promise.reject(new Error('Description cannot exceed 200 words!'));
      }
    }
    return Promise.resolve();
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
      // console.log(file);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
    setPreviewVisible(true);
  };

  const handleImageUpload = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // Example maximum file size for images (10MB)
    try {
      // Check if a file is selected
      if (!file || !file.file || !file.file.originFileObj) {
        // Handle case where no file is selected
        return;
      }
      // Check file size against the maximum allowed size
      if (file.file.originFileObj.size > MAX_FILE_SIZE) {

        return false // Prevent the file from being uploaded
      }
      // Proceed with setting the image upload state and updating progress
      setImageUpload(file.file.originFileObj);
      setUploadProgress(prevState => ({ ...prevState, poster: file.percent }));
      setUploadStatus(prevStatus => ({ ...prevStatus, poster: true }));
      return true;
    } catch (error) {
      console.error('Error handling image upload:', error);
      // Handle other errors, if any
    }
  };

  const handleImageUpload1 = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // Example maximum file size for images (5MB)
    try {
      // Check if a file is selected
      if (!file || !file.file || !file.file.originFileObj) {
        // Handle case where no file is selected
        return;
      }
      // Check file size against the maximum allowed size
      if (file.file.originFileObj.size > MAX_FILE_SIZE) {
        return false;
      }

      // Proceed with setting the image upload state and updating progress
      setImageUpload1(file.file.originFileObj);
      setUploadProgress(prevState => ({ ...prevState, thumbnail: file.percent }));
      setUploadStatus(prevStatus => ({ ...prevStatus, thumbnail: true }));
      return true;
    } catch (error) {
      console.error('Error handling image upload:', error);
      // Handle other errors, if any
    }
  };


  const handleImageUpload2 = ({ fileList }) => {

    try {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maximum file size for each image (5MB)
      let valid = true;
      fileList.forEach((file) => {
        if (file.originFileObj.size > MAX_FILE_SIZE) {
          valid = false;
        }
      });
      if (!valid) {
        return false;
      }
      const arrayImages = fileList.map((file) => file.originFileObj);
      setUploadProgress((prevState) => ({ ...prevState, images: fileList.length }));
      setUploadStatus((prevStatus) => ({ ...prevStatus, images: fileList.length <= 5 }));
      setImagesUpload(arrayImages);
      // console.log(imagesUpload, 'Multiple images uploaded');
      return true;
    } catch (error) {
      console.error('Error handling image upload:', error);
    }
  };



  useEffect(() => {
    // Check if all files are uploaded
    if (uploadStatus.images && uploadStatus.thumbnail && uploadStatus.images) {
      setButtonDisabled(false); // Enable button
    } else {
      setButtonDisabled(true); // Disable button
    }
  }, [uploadStatus]);

  // console.log(buttonDisabled,'Button disabled');

  const calculateOverallProgress = () => {
    let progress = 0;
    if (uploadStatus.poster) progress += 33;
    if (uploadStatus.thumbnail) progress += 33;
    if (uploadStatus.images) progress += 34;
    return progress;
  };



  const handleUpload = async () => {
    setUploading(true);
    setLoading(true);
   
    // Handle image uploads (assuming you have two imageUpload variables)
    const imageFormDatas = [imageUpload, imageUpload1, ...imagesUpload];
    // console.log(localStorage.getItem('MusicianId'),'MusicianId Poster');
    for (let i = 0; i < imageFormDatas.length; i++) {
      const imageFormData = new FormData();
      imageFormData.append('files', imageFormDatas[i]);
      imageFormData.append('refId', localStorage.getItem("MusicianId"))
      imageFormData.append('ref', 'api::musician.musician')


      if (i == 0) {
        imageFormData.append('field', "Poster")
        const newFileData = {
          alternativeText: localStorage.getItem("MusicianId"),
          caption: 'Poster',
        };
        imageFormData.append('fileInfo', JSON.stringify(newFileData));
      }
      else if (i == 1) {
        imageFormData.append('field', "Thumbnail")
        const newFileData = {
          alternativeText: localStorage.getItem("MusicianId"),
          caption: 'Thumbnail',
        };
        imageFormData.append('fileInfo', JSON.stringify(newFileData));
      }
      else {
        imageFormData.append('field', "Images")
        const newFileData = {
          alternativeText: localStorage.getItem("MusicianId"),
          caption: 'Images',
        };
        imageFormData.append('fileInfo', JSON.stringify(newFileData));
      }
      // Handle image upload
      try {
        const imageResponse = await axios.post(`${API_URL}/api/upload`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization':`Bearer ${Token}`,
          },
        });
        // console.log('All uploads completed');
        // console.log(`Image ${i + 1} upload response:`, imageResponse);
        setCurrentStep(currentStep + 1);
        setLoading(false);
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
      } finally {
        setUploading(false);
        setLoading(false);
      }
    }

    if(videoUpload){
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
    videoFormData.append('refId', localStorage.getItem("MusicianId"))
    videoFormData.append('ref', 'api::musician.musician')
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
    }
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




  const handleFinish = () => {
    // Your final submission logic goes here
    antMessage.success('Form submitted successfully!');
  };


  const toggleAgreement = () => {
    setAgreed(!agreed);
  };

  const handleVideoUpload = (file) => {
    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB for reels

    try {
      const videoFile = file?.file?.originFileObj;

      if (!videoFile) {
        console.error('No file found.');
        return;
      }

      // Check file size
      if (videoFile.size > MAX_FILE_SIZE) {
        antMessage.error('Reel size exceeds the maximum limit of 200MB.');
        return;
      }

      // Check file type
      const isMp4 = videoFile.type === 'video/mp4';
      if (!isMp4) {
        antMessage.error('Only MP4 format is allowed for reels.');
        return;
      }

      // Set file state
      setVideoUpload(videoFile);

      // Optional progress (depends on actual upload implementation)
      setUploadProgress(prev => ({ ...prev, movie: file.percent || 100 }));
      setUploadStatus(prev => ({ ...prev, movie: true }));

    } catch (error) {
      console.error('Error handling video upload:', error);
      antMessage.error('Something went wrong while uploading the reel.');
    }
  };


const handlePayment = async (e) => {
    e.preventDefault();

      if (finalPrice <= 0) {
        antMessage.error('Invalid payment amount');
        return;
      }
    
    try {
      // Get Razorpay key
      const keyResponse = await axios.get(`${API_URL}/api/razorpay`, option1);
      const keyId = keyResponse.data.data.attributes.keyId;
      const key_secret = keyResponse.data.data.attributes.keySecret;
      // Create order
      const orderResponse = await axios.post(`${API_URL}/api/contests/${finalPrice}/create-order`, {}, option1);
      const order = orderResponse.data;

      // Razorpay options
      const options = {
        key: keyId,
        key_secret: key_secret,
        amount: order.price,
        currency: "INR",
        order_id: order.id,
        name: "MovieMads",
        config: {
          display: {
            blocks: {
              banks: {
                name: 'All payment methods',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'wallet' },
                  { method: 'netbanking' },
                ],
              },
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: false
            },
          },
        },
        handler: async function (Paymentresponse) {
         antMessage.info('Please do not refresh the page');
          try {
            const paymentResponse = await axios.post(`${API_URL}/api/musicians/${localStorage.getItem('MusicianId')}/${Paymentresponse.razorpay_payment_id}/payment`, {}, option1);
            handleFinish();  // Make sure handleFinish is defined and handles any async operations
            // console.log(paymentResponse, 'payment response');
            window.location.href = "/";
          } catch (error) {
            console.error('Error in payment handler:', error);
          }
        },
      };

      // Open Razorpay payment interface
      const pay = new window.Razorpay(options);
      pay.open();
    } catch (error) {
      console.error('Error in handlePayment:', error);
    }
  };


  return (
    <>
      <Topnav />
      <Header />
      <div className="container">
        <div>
          <h1 className='contest-heading'>Musician form <p style={{ fontSize: '1.5rem', padding: '0', margin: '0' }}>(Entry fee of <p className='strikeOut'>Rs.999</p> Now Rs.{discount > 0 ? (<>{finalPrice}</>) : (<>{price}</>)} only)</p> </h1>
        </div>


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
                <Step title="Payment" />
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
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please Enter Your Name!' }]}
                        className="input-container"
                        // initialValue={yourName}
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
                        label="Email Address"
                        name="emailId"
                        type="email"
                        rules={[{ required: true, message: 'Please Enter Your Email address!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Known Languages (English,Tamil...etc)"
                        name="language"
                        rules={[{ required: true, message: 'Please Enter Your known Languages!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                    <div className='Two input'>
                      <Form.Item
                        label="Gender"
                        name="category"
                        rules={[{ required: true, message: 'Please Select a Category!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Select>
                          <Select.Option value="Male">Male</Select.Option>
                          <Select.Option value="Female">Female</Select.Option>
                          <Select.Option value="ChildArtist">Child Artist</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Age"
                        name="age"
                        rules={[{ required: true, message: 'Please Enter Hair Color!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>


                    </div>
                    <div className='Two input'>
                      <Form.Item
                        label="Describe Yourself (Max 200 words!)"
                        name="description"
                        rules={[
                          { required: true, message: 'Please describe about yourself!' },
                          { validator: validateWordCount }
                        ]}
                        className="input-container"
                        onChange={handleInputChange}

                      >
                        <TextArea rows={6}
                          placeholder='Discribe about your performance experience' />
                      </Form.Item>
                      <div className="input-container">
                        <Form.Item
                          label="Primary Instrument or Vocal Type"
                          name="primaryInstrument"
                          rules={[{ required: true, message: 'Please specify your primary instrument or vocal type!' }]}
                          className="input-container"
                        >
                          <Input
                            placeholder="E.g., Guitarist, Drummer, Vocalist (Soprano, Tenor, etc.)"
                            onChange={handleInputChange}
                          />
                        </Form.Item>
                        {/* Musical Genres Section */}
                        <Form.Item
                          label="Musical Genres"
                          name="musicalGenre"
                          rules={[{ required: true, message: 'Please select at least one genre!' }]}
                        >
                          <Select
                            mode="tags"
                            placeholder="Select genres or type to add new"
                            tokenSeparators={[',']}
                            value={genres}
                            onChange={(values) => setMusicalGener(values.join(','))}

                            onInputKeyDown={(e) => {
                              if (['Enter', ','].includes(e.key)) {
                                e.preventDefault();
                                const inputValue = e.target.value.trim();
                                if (inputValue && !genres.includes(inputValue)) {
                                  const newGenres = [...genres, inputValue];
                                  setGenres(newGenres);
                                  e.target.value = '';
                                }
                              }
                            }}
                          >
                            <Select.Option value="Pop">Pop</Select.Option>
                            <Select.Option value="Classical">Classical</Select.Option>
                            <Select.Option value="Rock">Rock</Select.Option>
                            <Select.Option value="Jazz">Jazz</Select.Option>
                            <Select.Option value="R&B">R&B</Select.Option>
                            <Select.Option value="Hip Hop">Hip Hop</Select.Option>
                            <Select.Option value="Country">Country</Select.Option>
                            <Select.Option value="Folk">Folk</Select.Option>
                            <Select.Option value="Electronic">Electronic</Select.Option>
                          </Select>
                        </Form.Item>




                      </div>
                    </div>

                    <div className='Two input'>
                      <Form.Item
                        label="Formal Training / Education"
                        name="formalTraining"
                        rules={[{ required: true, message: 'Please describe your musical education!' }]}
                        className="input-container"
                      >
                        <Input
                          placeholder="Music School, Certifications, Self-taught, etc."
                          onChange={handleInputChange}
                        />
                      </Form.Item>



                      <Form.Item
                        label="Years of Experience"
                        name="yearofexperience"
                        rules={[{ required: true, message: 'Please enter your experience!' }]}
                        onChange={handleInputChange}
                      >
                        <Input

                        />
                      </Form.Item>
                    </div>




                    <div className='Two input'>
                      {/* <Form.Item
                        label="Can you read sheet music/tabs/notation?"
                        name="canReadMusic"
                        rules={[{ required: false, message: 'Please select an option!' }]}
                        className="input-container"
                      >
                        <ConfigProvider
                          theme={{
                            components: {
                              Radio: {
                                colorPrimary: '#e50914', // Red color for selected state
                                buttonSolidCheckedBg: '#e50914',
                                buttonSolidCheckedHoverBg: '#c40812',
                                buttonBg: '#495057', // Dark background for unselected
                                buttonCheckedBg: '#e50914', // Red when selected
                                colorText: '#ffffff',
                                colorBorder: '#495057',
                                borderRadiusSM: 0, // Square corners
                              },
                            },
                          }}
                        >
                          <Radio.Group
                            onChange={(e) => setCanReadMusic(e.target.value)}
                            optionType="button"
                            buttonStyle="solid"
                            style={{
                              width: '100%',
                              display: 'flex',
                              gap: '8px',
                            }}
                          >
                            <Radio.Button
                              value="Yes"
                              style={{
                                flex: 1,
                                textAlign: 'center',
                              }}
                            >
                              Yes
                            </Radio.Button>
                            <Radio.Button
                              value="Somewhat"
                              style={{
                                flex: 1,
                                textAlign: 'center',
                              }}
                            >
                              Somewhat
                            </Radio.Button>
                            <Radio.Button
                              value="No"
                              style={{
                                flex: 1,
                                textAlign: 'center',
                              }}
                            >
                              No
                            </Radio.Button>
                          </Radio.Group>
                        </ConfigProvider>
                      </Form.Item> */}
                      <Form.Item
  label="Can you read sheet music/tabs/notation?"
  name="canReadMusic"
  rules={[{ required: false, message: 'Please select an option!' }]}
  className="input-container"
>
  <ConfigProvider
    theme={{
      components: {
        Radio: {
          colorPrimary: '#e50914',
          buttonSolidCheckedBg: '#e50914',
          buttonSolidCheckedHoverBg: '#c40812',
          buttonBg: '#495057',
          buttonCheckedBg: '#e50914',
          colorText: '#ffffff',
          colorBorder: '#495057',
          borderRadiusSM: 0,
        },
      },
    }}
  >
    <Radio.Group
      onChange={(e) => form.setFieldsValue({ canReadMusic: e.target.value })}// Simplified like Select
      optionType="button"
      buttonStyle="solid"
      style={{
        width: '100%',
        display: 'flex',
        gap: '8px',
      }}
    >
      <Radio.Button value="Yes" style={{ flex: 1, textAlign: 'center' }}>
        Yes
      </Radio.Button>
      <Radio.Button value="Somewhat" style={{ flex: 1, textAlign: 'center' }}>
        Somewhat
      </Radio.Button>
      <Radio.Button value="No" style={{ flex: 1, textAlign: 'center' }}>
        No
      </Radio.Button>
    </Radio.Group>
  </ConfigProvider>
</Form.Item>
                      <Form.Item
                        label="Band or Solo Experience"
                        name="bandExperience"
                        value={bandExperience}
                        rules={[{ required: true, message: 'Please select your experience type!' }]}
                        className="input-container"
                      >
                        <Select
                          placeholder="Select your experience type"
                          
                               onChange={(value) => setBandExperience(value)} // Directly set state
                        >
                          <Select.Option value="Solo only">Solo only</Select.Option>
                          <Select.Option value="Band only">Band only</Select.Option>
                          <Select.Option value="Both solo and band">Both solo and band</Select.Option>
                          <Select.Option value="Session musician">Session musician</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="Two input">

                      <Form.Item
                        label="Paste Your Instagram link"
                        name="instaLink"
                        rules={[{ required: true, message: 'Please Paste Your Instagram URL!' }]}
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Referral Code"
                        name="refcode"
                        className="input-container"
                        onChange={handleInputChange}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Coupon Code"
                        help={message}
                        validateStatus={discount > 0 ? 'success' : message && 'error'}
                      >
                        <Space.Compact style={{ width: '100%' }}>
                          <Input
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Enter coupon code"
                            disabled={discount > 0}
                          />
                          <Button
                            type="primary"
                            onClick={applyCoupon}
                            loading={loading}
                            disabled={discount > 0}
                          >
                            {discount > 0 ? 'Applied' : 'Apply'}
                          </Button>
                        </Space.Compact>
                      </Form.Item>



                    </div>


                    {/* Add other form fields here */}
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
                          <h3>Upload Poster </h3>
                               <h4 style={{ marginBottom: '15px'}}>( 500 x 750 px)</h4>
                          <Form.Item
                           style={{justifyItems:'center'}}
                            name="poster"
                            rules={[{ required: true, message: 'Please Upload the Movie' }]}
                            className="input-container"
                          >
                            <Upload

                              listType="picture-card"
                              onPreview={handlePreview}
                              beforeUpload={(file) => {
                                const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maximum file size for each image (3MB)
                                if (file.size > MAX_FILE_SIZE) {
                                antMessage.error('File size exceeds the maximum limit of 5MB.');
                                  return Upload.LIST_IGNORE; // Prevent the file from being uploaded
                                }
                                return true;
                              }}
                              onChange={handleImageUpload}
                              maxCount={1}
                              accept="image/*"

                            >
                              {uploadButton}
                            </Upload>
                          </Form.Item>
                          {/* {fileSizeError && <p className='SizeError'>Image size exceeds the limit</p>} */}
                          <span >( Maximum 5MB )</span>
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
                          <h3>Upload Thumbnail</h3>
                         <h4 style={{ marginBottom: '15px'}}>( 1280 x 720 px )</h4>
                          <Form.Item
                           style={{justifyItems:'center'}}
                            name="thumbnail"
                            rules={[{ required: true, message: 'Please Upload the Movie' }]}
                            className="input-container"
                          >
                            <Upload
                              listType="picture-card"
                              onPreview={handlePreview}
                              beforeUpload={(file) => {
                                const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maximum file size for each image (3MB)
                                if (file.size > MAX_FILE_SIZE) {
                               antMessage.error('File size exceeds the maximum limit of 5MB.');
                                  return Upload.LIST_IGNORE; // Prevent the file from being uploaded
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
                          {/* {fileSizeError1  && <p className='SizeError'>Image size exceeds the limit</p>} */}
                          <span >( Maximum 5MB )</span>
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
                          <h3>Upload Images</h3>
              <h4 style={{ marginBottom: '15px'}}>( Max 5 images )</h4>
                          <Form.Item
                           style={{justifyItems:'center'}}
                            name="images"
                            rules={[{ required: true, message: 'Please Upload the Images' }]}
                            className="input-container"
                          >
                            <Upload
                              listType="picture-card"
                              onPreview={handlePreview}
                              onChange={handleImageUpload2}
                              beforeUpload={(file) => {
                                const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maximum file size for each image (3MB)
                                if (file.size > MAX_FILE_SIZE) {
                                 antMessage.error('File size exceeds the maximum limit of 3MB.');
                                  return Upload.LIST_IGNORE; // Prevent the file from being uploaded
                                }
                                return true;
                              }}
                              multiple
                              maxCount={5}
                              accept="image/*"
                            >
                              {imagesUpload.length < 5 && uploadButton}
                            </Upload>
                          </Form.Item>
                          {/* {fileSizeError2 && <p className='SizeError'>Image size exceeds the limit</p>} */}
                          <span >( Max 5MB Each )</span>
                        </div>

                        <div style={{ marginBottom: '40px', textAlign: 'center', lineHeight: '5px' }}>
                          <h3>Upload Reel</h3>
                            <h4 style={{ marginBottom: '15px'}}>(1080 x 1920 px)</h4>

                          <Form.Item
                           style={{justifyItems:'center'}}
                            name="reel"
                            rules={[{ required: false, message: 'Please upload the reel' }]}
                            className="input-container"
                          >
                            <Upload
                              listType="picture-card"
                              onPreview={handlePreview}
                              beforeUpload={(file) => {
                                const MAX_FILE_SIZE = 200 * 1024 * 1024; // ~200MB
                                if (file.size > MAX_FILE_SIZE) {
                                  antMessage.error('Reel size exceeds the limit of 200MB.');
                                  return Upload.LIST_IGNORE;
                                }
                                const isMp4 = file.type === 'video/mp4';
                                if (!isMp4) {
                                antMessage.error('Only MP4 format is allowed for reels.');
                                  return Upload.LIST_IGNORE;
                                }
                                return true;
                              }}
                              onChange={handleVideoUpload}
                              maxCount={1}
                              accept="video/mp4"
                            >
                              {uploadButton}
                            </Upload>
                          </Form.Item>

                          {fileSizeError2 && (
                            <p className="SizeError" style={{ color: 'red', marginBottom: '5px' }}>
                              Reel size exceeds the limit
                            </p>
                          )}
                          <span>( Maximum 200MB, MP4 only )</span>
                        </div>
                      </div>
                      <Progress percent={calculateOverallProgress()} />
                      <div style={{ marginTop: 40 }}>
                        <Button onClick={prevStep}>
                          <LeftOutlined /> Previous
                        </Button>
                        <Button type="primary" disabled={buttonDisabled} style={{ float: 'right' }} onClick={handleUpload}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
                {currentStep === 2 && (
                  <div>
                    <div style={{ height: '500px', overflow: 'auto' }}>
                      <h2>Terms and Conditions for Musician Application</h2>
                      <ol>
                        <li><strong style={{ color: '#ff0015' }}>Categories</strong>: The contest is open to three categories of musician: male, female, and child artist.</li>
                        <li><strong style={{ color: '#ff0015' }}>Eligibility</strong>: Applicants must meet the age and other eligibility requirements specified for their respective category.</li>
                        <li><strong style={{ color: '#ff0015' }}>Application Process</strong>: Applicants must complete the application form accurately and submit any required supporting materials along with the payment.</li>
                        <li><strong style={{ color: '#ff0015' }}>Payment and Refunds</strong>: There is a non-refundable fee for submitting the application. No refunds will be issued after the payment is made.</li>
                        <li><strong style={{ color: '#ff0015' }}>Profile Review</strong>: After payment, each application will be reviewed. Profiles will be published on the website if they meet the contest standards and criteria.</li>
                        <li><strong style={{ color: '#ff0015' }}>Publication</strong>: Approved profiles will be published on the contest website, where they can be viewed by directors and other industry professionals.</li>
                        <li><strong style={{ color: '#ff0015' }}>Selection Criteria</strong>: Selection and approval of profiles will be based on criteria set by the contest organizers, including but not limited to appearance, charisma, and suitability for musician.</li>
                        <li><strong style={{ color: '#ff0015' }}>Usage Rights</strong>: By applying, applicants grant the organizers the right to use their submitted photos and personal information for promotional and contest-related purposes.</li>
                        <li><strong style={{ color: '#ff0015' }}>No Guarantee</strong>: Submission of an application and payment does not guarantee selection as a contest participant or publication of the profile.</li>
                        <li><strong style={{ color: '#ff0015' }}>Facilitation of Connections</strong>: The organizers will facilitate connections between musicians and interested parties such as directors or others who wish to hire musicians from the published list.</li>
                        <li><strong style={{ color: '#ff0015' }}>Musician Release</strong>: Selected participants will be required to sign a musician release form, granting the organizers permission to use their likeness in promotional materials.</li>
                        <li><strong style={{ color: '#ff0015' }}>Indemnification</strong>: Applicants agree to indemnify the contest organizers against any legal claims arising from the use of their submitted materials.</li>
                        <li><strong style={{ color: '#ff0015' }}>Termination</strong>: The organizers reserve the right to terminate the contest or disqualify participants at their discretion.</li>
                        <li><strong style={{ color: '#ff0015' }}>Compliance with Laws</strong>: Applicants must comply with all local, state, and federal laws and regulations. Failure to comply may result in disqualification.</li>
                        <li><strong style={{ color: '#ff0015' }}>Confidentiality</strong>: Applicants agree to keep all contest-related information confidential and not disclose any details to third parties without the organizer's consent.</li>
                        <li><strong style={{ color: '#ff0015' }}>Data Protection</strong>: The organizers will handle all personal data in accordance with applicable data protection laws. Applicants have the right to access and request the correction or deletion of their personal data.</li>
                      </ol>
                    </div>
                    {/* Checkbox for agreement */}
                    <div style={{ marginTop: 10 }}>
                      <Checkbox checked={agreed} onChange={toggleAgreement}>
                        I agree to the terms and conditions
                      </Checkbox>
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <Button onClick={prevStep}>
                        <LeftOutlined /> Previous
                      </Button>
                      <Button type="primary" style={{ float: 'right' }} onClick={handlePayment} disabled={!agreed}>
                        Pay
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ConfigProvider>
          </div>
        )}
      </div>
    </>
  )
}


export default MusicianForm;