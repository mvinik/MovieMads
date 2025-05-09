import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, ConfigProvider, Form, Input, Modal,message, Skeleton,Dropdown, Menu } from "antd";
import {
  StarOutlined,
  VideoCameraAddOutlined,
  ShareAltOutlined,
  WhatsAppOutlined,
  TwitterOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import Footer from "../Footer/Footer";
import TextArea from "antd/es/input/TextArea";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import Topnav from "../TopNav/Topnav";
import Header from "../Header";
import ShareButton from "./ShareButton";


const ModelDetails = () => {
  const [details, setDetails] = useState(null); // Initialize details state as null
  const [images, setImages] = useState(null); // Initialize details state as null
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [form] = Form.useForm();
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const JWT = localStorage.getItem("User");
  const Token = localStorage.getItem("JwtToken");
  const UserId = localStorage.getItem("UserId");
  const [yourName,setYourName] =useState('');
  const [mobile,setMobile] =useState('');
  const [emailId,setEmailId] =useState('');
  const [messages,setMessages] =useState('');



  const handleOpenModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };
  const handleOpenModal1 = () => {
    setModalVisible1(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleCloseModal1 = () => {
    setModalVisible1(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/Models/${id}?populate=*`
      );
      const responseData = response.data.data;
      setDetails(responseData);
      // console.log(details,'model details');                          
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      console.error(err);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        setYourName(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "emailId":
        setEmailId(value);
        break;
      case "description":
        setMessages(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async() =>{
    try {
      const values = await form.validateFields();
      const res = await axios.post(`${API_URL}/api/hiring-models`,{
        data: {
          Name: values.yourName,
          MobileNumber:values.mobile,
          Email:values.emailId,
          Message:values.messages,
          model: id
        } 
      } 
      )
      message.success('Model Request submitted successfully!');
      setModalVisible1(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Failed to submit the model request!');
    }

  }

  const url = window.location.href;
  const title = "Check this out!";
 

 
  return (
    <>
    <Topnav/>
    <Header/>
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
                src={`${API_URL}${details?.attributes.Thumbnail.data.attributes.url}`}
              />
            </Backdrop>

            <DetailsContainer>
              <Title>{details?.attributes.Name}</Title>
              <Lang>
                {details?.attributes.Category}
                <span
                  style={{
                    fontWeight: "bold",
                    color: "red",
                    fontSize: "1.5em",
                    padding:'5px',
                  }}
                >|</span>{details?.attributes.Language}
              </Lang>
              <div className="two-input" style={{ margin: "10px 0" }}>
                <Look>
                  <span>
                    <StarOutlined /> Height:{" "}
                  </span>{" "}
                  {details?.attributes.Height} cm
                </Look>
                <Look>
                  <span>
                  <StarOutlined /> Weight:{" "}
                  </span>
                  {details?.attributes.Weight} kg
                </Look>
              </div>
              {/* <div className="Two input" > */}
              <Look style={{ margin: "10px 0" }}>
                <span>
                  <StarOutlined /> Hair Color:{" "}
                </span>{" "}
                {details?.attributes.HairColor}
              </Look>
              <Look>
                <span>
                <StarOutlined /> Eye Color:{" "}
                </span>
                {details?.attributes.EyeColor}{" "}
              </Look>
              <Look1><span> <StarOutlined /> Model_ID:{" "}</span>{details?.attributes?.Model_ID || "Model ID Does Not Exists"}</Look1>
              {/* </div> */}
              <Description>{details?.attributes.Description} </Description>
              <div className="two-input" style={{ margin: "10px 0" }}>
              <PlayButton onClick={handleOpenModal1}>Hire me</PlayButton>
              <div>
                <ShareButton url={url} title={title} />
              </div>
              </div>
              <Modal
                visible={modalVisible1}
                onCancel={handleCloseModal1}
                footer={null}
                style={{background:'none'}}
              >
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#fba010",
                      colorText: "#ffffff",
                      colorIcon: "#ffffff",
                    },
                    components: {
                      Button: {
                        colorPrimary: "#e50914",
                        algorithm: true,
                        colorBgContainerDisabled: "#495057",
                      },
                      Form: {
                        colorPrimary: "#ffffff",
                        colorText: "#ffffff",
                        colorTextTertiary: "#ffffff",
                        colorTextSecondary: "#ffffff",
                        colorFillSecondary: "#ffffff",
                        algorithm: true,
                        labelColor: "#ffffff",
                      },
                      Typography: {
                        colorPrimary: "#ffffff",
                      },
                      Notification: {
                        colorBgElevated: "#212529",
                      },
                      Input: {
                        colorBgContainer: "#212529",
                        colorPrimary: "#fba010",
                        algorithm: true,
                        colorText: "#ffffff",
                        colorBorder: "#495057",
                        borderRadius: 0,
                      },
                    },
                  }}
                >
                   <Form
            layout="vertical"
            size="large"
            className="form-container"
            style={{padding:'20px'}}
            form={form}
          >
            <div className='two-input' style={{justifyContent:'space-between'}}>
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
              rules={[{ required: true, message: 'Please Enter Mobile Number!' },{pattern: /^[0-9]{10}$/, message: 'Please Enter Valid Mobile Number!' }]} 
              className="input-container"
              onChange={handleInputChange}
            >
              <Input />
            </Form.Item>
              </div>
              <Form.Item
              label="Email Address"
              name="emailId"
              rules={[{ required: true, message: 'Please Enter Your Email address!' }]}
              className="input-container"
              onChange={handleInputChange}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Your Message to our Model"
              name="messages"
              rules={[{ required: true, message: 'Please Describe your Message' }]}
              className="input-container"
              onChange={handleInputChange}
            >
          <TextArea rows={5}   />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={handleSubmit} >
                Submit
              </Button>
            </Form.Item>
              </Form>
                </ConfigProvider>
              </Modal>
            </DetailsContainer>
          </>
        )}
      </Container>
      <h1 style={{ textAlign: "center" }}>
        <b style={{ color: "#e50914" }}>{details?.attributes.Name}'s</b> Images
      </h1>
      <Container>
        <Content1>
          {details?.attributes.Images.data.map((model,index) => (
            <>
              <div key={model.id}>
                <div className="movieTrailers-container1">
                  <img
                     src={`${API_URL}${model.attributes.url}`}
                     onClick={() => handleOpenModal(index)}
                    alt="Img"
                    id={model.id}
                  />
                </div>
              </div>
              <Modal
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
                style={{ overflowY: "hidden" }}
                className='Modal-Model'
              >
                <Carousel
                  selectedItem={selectedImageIndex}
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop
                  useKeyboardArrows
                >
          {details?.attributes.Images.data.map((model) => (
            <div key={model.id}>
              <img
              className="ModelImage"
                src={`${API_URL}${model.attributes.url}`}
                alt="Img"
              />
            </div>
          ))}
        </Carousel>
              </Modal>
            </>
          ))}
        </Content1>
      </Container>
      <Footer />
    </>
  );
};
export default ModelDetails;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 calc(3.5vw + 5px);
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const PlayButton = styled.button`
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  border: 0;
  background-color: white;
  box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-size: 15px;
  transition: all 0.5s ease;

  &:hover {
    letter-spacing: 3px;
    background-color: #e50914;
    color: hsl(0, 0%, 100%);
    box-shadow: #e50914 0px 7px 29px 0px;
  }
  &:active {
    letter-spacing: 3px;
    background-color: #e50914;
    color: hsl(0, 0%, 100%);
    box-shadow: #e50914 0px 0px 0px 0px;
    transform: translateY(10px);
    transition: 100ms;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 12px;
  }
`;
const Backdrop = styled.div`
  position: relative;
  flex: 0 0 60%; /* Adjust as needed */
  margin-right: 20px; /* Add some space between backdrop and details */
  max-width: 70%;
  max-height: 60vh;
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

const Content1 = styled.div`
  cursor: pointer;
  display: grid;
  grid-gap: 25px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
    &:hover {
      transform: scale(1.2);
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    grid-gap: 10px;
    height: 100%;
  }
`;

const DetailsContainer = styled.div`
  flex: 0 0 40%; /* Adjust as needed */
  @media (max-width: 768px) {
    margin-top: 20px;
    font-size: 12px;
  }
`;

const Title = styled.h2`
  margin-bottom: 0px;
  text-transform: uppercase;
`;

const Description = styled.p`
  line-height: 1.4;
`;
const Look = styled.p`
  line-height: 1;
  margin: 0;
  span {
    font-weight: bold;
    // text-transform: uppercase;
    color: #e50914;
  }
`;
const Look1 = styled.p`
  line-height: 2;
  margin: 0;
  span {
    font-weight: bold;
    // text-transform: uppercase;
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
    width: 750px;
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
