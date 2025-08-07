import React, { useState, useEffect } from 'react'
import MovieSlider from './MovieSlider'
import styled from 'styled-components'
import './MovieTrailers.css'
import { Link } from 'react-router-dom';
// Import Swiper styles
import './MovieTrailers.css'
import { ConfigProvider, Pagination } from 'antd';
import Footer from '../Footer/Footer';
import axios from 'axios';
import Header from '../Header';
import Topnav from '../TopNav/Topnav';
// import required modules
const API_URL = process.env.REACT_APP_API_URL;
const MovieTrailers = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(15);



  const [movies, setMovies] = useState([]);
  const getMovies = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/movies?populate=*&sort[0]=id:desc`);
      setMovies(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getMovies();
  }, []);


  // Function to filter movies based on search query, language, and genre
  const filteredMovies = movies.filter(movie => {
    // Filter by search query
    if (searchQuery && !movie.attributes.MovieName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter by selected language
    // if (selectedLanguage && movie.language !== selectedLanguage) {
    //   return false;
    // }
    // // Filter by selected genre
    // if (selectedGenre && !movie.genres.includes(selectedGenre)) {
    //   return false;
    // }
    return true;
  });

  // const totalPage = Math.ceil(filteredMovies.length / pageSize);

  const currentPageMovies = filteredMovies.slice((current - 1) * pageSize, current * pageSize);

  const onChange = (page) => {
    setCurrent(page);
  };



  return (
    <>
      <Topnav />
      <Header />
      <Container>
        <MovieSlider />
        <Toolbar>
          <p
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
              marginRight: "10px",
            }}
          >
            Movie Trailers
          </p>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Toolbar>

        <Content>
          {currentPageMovies.map((movie) => (
            <div key={movie.id}>
              <Link
                to={"/details/" + movie.id}
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="movieTrailers-container">
                  <img src={`${API_URL}${movie.attributes.MoviePoster.data.attributes.url}`} alt="Img" id={movie.id} />
                  <div className="Movietrailers-overlay">
                    <p className="movieTrailers-title">{movie.attributes.MovieName}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Content>
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
              size="large"
              current={current}
              onChange={onChange}
              total={filteredMovies.length}
              showSizeChanger={false}
              pageSize={pageSize}
            />
          </ConfigProvider>
        </PaginationWrapper>
      </Container>
      <Footer />
    </>
  );
}

export default MovieTrailers

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
  grid-template-columns: repeat(5, minmax(0, 1fr));
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
    height: 100%;
    grid-gap: 10px;
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

