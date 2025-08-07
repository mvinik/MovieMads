import React from 'react'
import Footer from '../Footer/Footer'
import ModelSlider from './ModelSlider'
import styled from 'styled-components'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConfigProvider, Pagination } from 'antd';
import Topnav from '../TopNav/Topnav';
import Header from '../Header';
import Singer from '../Singer/Singer';
import Dancer from '../Dancer/Dancer';
import Musician from '../Musician/Musician';

const API_URL = process.env.REACT_APP_API_URL;
const Token = localStorage.getItem("JwtToken");

const Model = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [current, setCurrent] = useState(1);
  const [current1, setCurrent1] = useState(1);
  const [current2, setCurrent2] = useState(1);
  const [pageSize] = useState(10);
  const [pageSize1] = useState(10);
  const [pageSize2] = useState(10);
  const [maleModel, setMaleModel] = useState([]);
  const [femaleModel, setFemaleModel] = useState([]);
  const [childArtist, setChildArtist] = useState([]);
  const [noMovie, setNoMovie] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  
const option1 = {
  headers: {
  'Authorization':`Bearer ${Token}`
  },
  };
  const handleOpenModal = () => {
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  


  const getMaleModel = async () => {
    try {
      const [modelsRes, agentModelsRes] = await Promise.all([
        axios.get(`${API_URL}/api/models?filters[Category][$eq]=Male&filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`),
        axios.get(`${API_URL}/api/agent-models?filters[Category][$eq]=Male&filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`)
      ]);
    
    console.log('Regular models count:', modelsRes.data.data.length);
    console.log('Agent models count:', agentModelsRes.data.data.length);
      const modelsData = modelsRes.data.data.map(item => ({
        ...item,
        type: "model"
      }));
  
      const agentModelsData = agentModelsRes.data.data.map(item => ({
        ...item,
        type: "agent-model"
      }));
  
      const combinedModels = [...modelsData, ...agentModelsData];
  
      setMaleModel(combinedModels);
    } catch (err) {
      console.error(err);
    }
  };
  
  const getFemaleModel = async () => {
    try {
      const [femaleModelsRes, agentFemaleModelsRes] = await Promise.all([
        axios.get(`${API_URL}/api/models?filters[Category][$eq]=Female&filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`),
        axios.get(`${API_URL}/api/agent-models?filters[Category][$eq]=Female&filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`)
      ]);
  
      const femaleModelsData = femaleModelsRes.data.data.map(item => ({
        ...item,
        type: "model"
      }));
  
      const agentFemaleModelsData = agentFemaleModelsRes.data.data.map(item => ({
        ...item,
        type: "agent-model"
      }));
  
      const combinedFemaleModels = [...femaleModelsData, ...agentFemaleModelsData];
  
      setFemaleModel(combinedFemaleModels);
    } catch (err) {
      console.error(err);
    }
  };
  
  const getChildArtist = async () => {
    try {
      const [childModelsRes, agentChildModelsRes] = await Promise.all([
        axios.get(`${API_URL}/api/models?filters[Category][$eq]=ChildArtist&filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`),
        axios.get(`${API_URL}/api/agent-models?filters[Category][$eq]=ChildArtist&filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`)
      ]);
  
      const childModelsData = childModelsRes.data.data.map(item => ({
        ...item,
        type: "model"
      }));
  
      const agentChildModelsData = agentChildModelsRes.data.data.map(item => ({
        ...item,
        type: "agent-model"
      }));
  
      const combinedChildModels = [...childModelsData, ...agentChildModelsData];
  
      setChildArtist(combinedChildModels);
    } catch (err) {
      console.error(err);
    }
  };
  

  
  useEffect(() => {
    getMaleModel();
    getFemaleModel();
    getChildArtist();
  },[]);

  const filteredMovies = maleModel.filter(movie => {
    if (searchQuery && !movie.attributes.Name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });
  const currentPageMovies = filteredMovies.slice((current - 1) * pageSize, current * pageSize);

  const onChange = (page) => {
    setCurrent(page);
  };


/////////////////////////////
  const filteredMovies1 = femaleModel.filter(movie => {
    if (searchQuery1 && !movie.attributes.Name.toLowerCase().includes(searchQuery1.toLowerCase())) {
      return false;
    }
    return true;
  });
  const currentPageMovies1 = filteredMovies1.slice((current1 - 1) * pageSize1, current1 * pageSize1);

  const onChange1 = (page) => {
    setCurrent1(page);
  };

  ////////////////////////////////////
  const filteredMovies2 = childArtist.filter(movie => {
    if (searchQuery2 && !movie.attributes.Name.toLowerCase().includes(searchQuery2.toLowerCase())) {
      return false;
    }
    return true;
  });
  const currentPageMovies2 = filteredMovies2.slice((current2 - 1) * pageSize2, current2 * pageSize2);

  const onChange2 = (page) => {
    setCurrent2(page);
  };

// console.log(currentPageMovies,'Current page')

  return (
    <>
    <Topnav/>
    <Header/>
  <Container>
    <ModelSlider/>
    {/* Model content starts */}
    <Toolbar>
        <p
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
            marginRight: "10px",
          }}
        >
           Male Artist 
        </p>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Toolbar>

      <Content1>
      {currentPageMovies && currentPageMovies.map((model) => (
          <div key={model?.id}>
            <Link
               to={`/${model?.type}/${model?.id}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="movieTrailers-container">
              <img src={`${API_URL}${model?.attributes?.Poster?.data?.attributes?.url}`} alt="Img" id={model?.id}/>
                <div className="Movietrailers-overlay">
                  <p className="movieTrailers-title">{model?.attributes?.Name}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Content1>

      <PaginationWrapper>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#e50914",
            colorText: "#ffffff",
            colorIcon: "#e50914",
          },
          components: {
            Pagination: {
              colorPrimary: "#e50914",
              itemSize: "42px",
              fontSize: "22px",
              borderRadius: "20px",
              colorBgTextHover: "#e50914",
            },
          },
        }}
      >
        <Pagination
          className="pagination"
          size="small"
          current={current}
          onChange={onChange}
          total={filteredMovies.length}
          showSizeChanger={false}
          pageSize={pageSize}
        />
      </ConfigProvider>
      </PaginationWrapper>
      
{/*                //////////////////////////////////////////////     */}

      <Toolbar>
        <p
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
            marginRight: "10px",
          }}
        >
           Female Artist
        </p>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery1}
          onChange={(e) => setSearchQuery1(e.target.value)}
        />
      </Toolbar>

      <Content1>
      { currentPageMovies1 && currentPageMovies1.map((model) => (
          <div key={model?.id}>
            <Link
              to={`/${model?.type}/${model?.id}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="movieTrailers-container">
              <img src={`${API_URL}${model?.attributes?.Poster?.data?.attributes?.url}`} alt="Img" id={model?.id}/>
                <div className="Movietrailers-overlay">
                  <p className="movieTrailers-title">{model?.attributes?.Name}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Content1>

      <PaginationWrapper>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#e50914",
            colorText: "#ffffff",
            colorIcon: "#e50914",
          },
          components: {
            Pagination: {
              colorPrimary: "#e50914",
              itemSize: "42px",
              fontSize: "22px",
              borderRadius: "20px",
              colorBgTextHover: "#e50914",
            },
          },
        }}
      >
        <Pagination
          className="pagination"
          size="small"
          current={current1}
          onChange={onChange1}
          total={filteredMovies1.length}
          showSizeChanger={false}
          pageSize={pageSize1}
        />
      </ConfigProvider>
      </PaginationWrapper>


      {/*                //////////////////////////////////////////////     */}

      <Toolbar>
        <p
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
            marginRight: "10px",
          }}
        >
          Child Artist
        </p>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery2}
          onChange={(e) => setSearchQuery2(e.target.value)}
        />
      </Toolbar>

      <Content1>
      {currentPageMovies2 && currentPageMovies2.map((model) => (
          <div key={model?.id}>
            <Link
              to={`/${model?.type}/${model?.id}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="movieTrailers-container">
              <img src={`${API_URL}${model?.attributes?.Poster?.data?.attributes?.url}`} alt="Img" id={model?.id}/>
                <div className="Movietrailers-overlay">
                  <p className="movieTrailers-title">{model?.attributes?.Name}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Content1>

      <PaginationWrapper>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#e50914",
            colorText: "#ffffff",
            colorIcon: "#e50914",
          },
          components: {
            Pagination: {
              colorPrimary: "#e50914",
              itemSize: "42px",
              fontSize: "22px",
              borderRadius: "20px",
              colorBgTextHover: "#e50914",
            },
          },
        }}
      >
        <Pagination
          className="pagination"
          size="small"
          current={current2}
          onChange={onChange2}
          total={filteredMovies2.length}
          showSizeChanger={false}
          pageSize={pageSize2}
        />
      </ConfigProvider>
      </PaginationWrapper>


    {/* Model content ends */}
  </Container>

  <Singer/>
  <Dancer/>
  <Musician/>
    <Footer />
   </>
  )
}

export default Model;


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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Content = styled.div`
cursor: pointer;
  display: grid;
  grid-gap: 25px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  &:hover{
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


const Content1 = styled.div`
cursor: pointer;
  display: grid;
  grid-gap: 25px;
  grid-template-columns: repeat(5, minmax(0, 2fr));
img{
  width: 100%;
  height: 250px;
  object-fit: cover;
  opacity: 0.9;
  &:hover{
    transform: scale(1.2);
  }
}
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    grid-gap: 10px;
    height: 100%;
    img{
      height: 150px;
    }
  }
  
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: space-between;
  padding: 15px;
  background-color: #101011;

  p {
    font-size: 20px;
    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const SearchInput = styled.input`
  margin-right: 10px;
  padding: 15px;
  border: 0px inset #ff0015;
  background-color: #212529;
  border-radius: 5px;
  color: #fba010;
  float: right;
  width: 30%;
  @media (max-width: 768px) {
    width: 60%;
    padding: 10px;
  }
`;

const LanguageSelect = styled.select`
  margin-right: 10px;
  padding: 15px;
  border: 1px solid #fba010;
  background-color: transparent;
  color: #fba010;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GenreSelect = styled.select`
  padding: 15px;
  border: 1px solid #fba010;
  background-color: transparent;
  color: #fba010;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

