// import React from 'react';
// import styled from 'styled-components';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ConfigProvider, Pagination } from 'antd';
// import Topnav from '../TopNav/Topnav';
// import Header from '../Header';

// const API_URL = process.env.REACT_APP_API_URL;
// const Token = localStorage.getItem("JwtToken");

// const Singer = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [current, setCurrent] = useState(1);
//   const [pageSize] = useState(10);
//   const [singers, setSingers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const option1 = {
//     headers: {
//       'Authorization': `Bearer ${Token}`,
//       'Content-Type': 'application/json'
//     },
//   };

//   // const getAllSingers = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const response = await axios.get(
//   //       `${API_URL}/api/singers?filters[Payment][$eq]=Paid&populate=*`,
//   //       option1
//   //     );
      
//   //     const singersData = response.data.data.map(item => ({
//   //       ...item,
//   //       type: "singer",
//   //       attributes: {
//   //         ...item.attributes,
//   //         // Safely get poster image URL with fallback
//   //         posterUrl: item.attributes.Poster?.data?.[0]?.attributes?.url 
//   //           ? `${API_URL}${item.attributes.Poster.data[0].attributes.url}`
//   //           : '/placeholder-image.jpg'
//   //       }
//   //     }));

//   //     setSingers(singersData);
//   //   } catch (err) {
//   //     console.error("Error fetching singers:", err);
//   //     setError("Failed to load singers. Please try again later.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const getAllSingers = async () => {
//   try {
//     setLoading(true);
//     const headers = {
//       'Content-Type': 'application/json',
//     };

//     // Only add token if exists
//     const token = localStorage.getItem("JwtToken");
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     const response = await axios.get(
//       `${API_URL}/api/singers?filters[Payment][$eq]=Paid&populate=*`,
//       { headers }
//     );

//     const singersData = response.data.data.map(item => ({
//       ...item,
//       type: "singer",
//       attributes: {
//         ...item.attributes,
//         posterUrl: item.attributes.Poster?.data?.[0]?.attributes?.url 
//           ? `${API_URL}${item.attributes.Poster.data[0].attributes.url}`
//           : '/placeholder-image.jpg'
//       }
//     }));

//     setSingers(singersData);
//   } catch (err) {
//     console.error("Error fetching singers:", err);
//     setError("Failed to load singers. Please try again later.");
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     getAllSingers();
//   }, []);

//   const filteredSingers = singers.filter(singer => {
//     if (searchQuery && !singer.attributes.Name?.toLowerCase().includes(searchQuery.toLowerCase())) {
//       return false;
//     }
//     return true;
//   });

//   const currentPageSingers = filteredSingers.slice((current - 1) * pageSize, current * pageSize);

//   const onChange = (page) => {
//     setCurrent(page);
//   };

//   return (
//     <>
     
//       <Container>
//         <Toolbar>
//           <p
//             style={{
//               fontWeight: "bold",
//               textTransform: "uppercase",
//               marginRight: "10px",
//             }}
//           >
//             Singers
//           </p>
//           <SearchInput
//             type="text"
//             placeholder="Search singers..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </Toolbar>

//         {loading ? (
//           <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading singers...</div>
//         ) : error ? (
//           <div style={{ color: '#e50914', textAlign: 'center', padding: '20px' }}>{error}</div>
//         ) : (
//           <>
//             <Content1>
//               {currentPageSingers.map((singer) => (
//                 <div key={singer?.id}>
//                   <Link
//                     to={`/${singer?.type}/${singer?.id}`}
//                     onClick={() => window.scrollTo(0, 0)}
//                   >
//                     <div className="movieTrailers-container">
//                       <img 
//                         src={singer.attributes.posterUrl}
//                         alt={singer.attributes.Name || 'Singer'}
//                         id={singer?.id}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = '/placeholder-image.jpg';
//                         }}
//                       />
//                       <div className="Movietrailers-overlay">
//                         <p className="movieTrailers-title">{singer.attributes.Name}</p>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </Content1>

//             <PaginationWrapper>
//               <ConfigProvider
//                 theme={{
//                   token: {
//                     colorPrimary: "#e50914",
//                     colorText: "#ffffff",
//                     colorIcon: "#e50914",
//                   },
//                   components: {
//                     Pagination: {
//                       colorPrimary: "#e50914",
//                       itemSize: "42px",
//                       fontSize: "22px",
//                       borderRadius: "20px",
//                       colorBgTextHover: "#e50914",
//                     },
//                   },
//                 }}
//               >
//                 <Pagination
//                   className="pagination"
//                   size="small"
//                   current={current}
//                   onChange={onChange}
//                   total={filteredSingers.length}
//                   showSizeChanger={false}
//                   pageSize={pageSize}
//                 />
//               </ConfigProvider>
//             </PaginationWrapper>
//           </>
//         )}
//       </Container>
//     </>
//   )
// }

// export default Singer;



// const Container = styled.main`
//   min-height: calc(10vh - 70px);
//   padding: 0 calc(3.5vw + 5px);
//   position: relative;
//   padding-bottom: 50px;
//   overflow-x: hidden;
//   &:before {
//     // background: url("/images/home-background.png") center center / cover
//       no-repeat fixed;
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     z-index: -1;
//   }
// `;

// const PaginationWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// `;

// const Content = styled.div`
// cursor: pointer;
//   display: grid;
//   grid-gap: 25px;
//   grid-template-columns: repeat(3, minmax(0, 1fr));
// img{
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   opacity: 0.9;
//   &:hover{
//     transform: scale(1.2);
//   }
// }
//   @media (max-width: 768px) {
//     grid-template-columns: repeat(2, minmax(0, 1fr));
//     width: 100%;
//     grid-gap: 10px;
//     height: 100%;
//   }
// `;


// const Content1 = styled.div`
// cursor: pointer;
//   display: grid;
//   grid-gap: 25px;
//   grid-template-columns: repeat(5, minmax(0, 2fr));
// img{
//   width: 100%;
//   height: 250px;
//   object-fit: cover;
//   opacity: 0.9;
//   &:hover{
//     transform: scale(1.2);
//   }
// }
//   @media (max-width: 768px) {
//     grid-template-columns: repeat(3, minmax(0, 1fr));
//     width: 100%;
//     grid-gap: 10px;
//     height: 100%;
//     img{
//       height: 150px;
//     }
//   }
  
// `;

// const Toolbar = styled.div`
//   display: flex;
//   align-items: center;
//   margin-top: 20px;
//   margin-bottom: 20px;
//   justify-content: space-between;
//   padding: 15px;
//   background-color: #101011;

//   p {
//     font-size: 20px;
//     @media (max-width: 768px) {
//       font-size: 15px;
//     }
//   }

//   @media (max-width: 768px) {
//     padding: 10px;
//   }
// `;

// const SearchInput = styled.input`
//   margin-right: 10px;
//   padding: 15px;
//   border: 0px inset #ff0015;
//   background-color: #212529;
//   border-radius: 5px;
//   color: #fba010;
//   float: right;
//   width: 30%;
//   @media (max-width: 768px) {
//     width: 60%;
//     padding: 10px;
//   }
// `;

// const LanguageSelect = styled.select`
//   margin-right: 10px;
//   padding: 15px;
//   border: 1px solid #fba010;
//   background-color: transparent;
//   color: #fba010;

//   @media (max-width: 768px) {
//     width: 100%;
//   }
// `;

// const GenreSelect = styled.select`
//   padding: 15px;
//   border: 1px solid #fba010;
//   background-color: transparent;
//   color: #fba010;
//   @media (max-width: 768px) {
//     width: 100%;
//   }
// `;

import React from 'react'
import styled from 'styled-components'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConfigProvider, Pagination } from 'antd';

const API_URL = process.env.REACT_APP_API_URL;
const Token = localStorage.getItem("JwtToken");

const Singer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [allSingers, setAllSingers] = useState([]);
  const [noData, setNoData] = useState(false);

  const option1 = {
    headers: {
      'Authorization': `Bearer ${Token}`
    },
  };

  const getAllSingers = async () => {
    try {
      const [singersRes, agentSingersRes] = await Promise.all([
        axios.get(`${API_URL}/api/singers?filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`),
        axios.get(`${API_URL}/api/agent-singers?filters[Payment][$eq]=Paid&populate=*&pagination[pageSize]=100`)
      ]);

      const singersData = singersRes.data.data.map(item => ({
        ...item,
        type: "singer"
      }));

      const agentSingersData = agentSingersRes.data.data.map(item => ({
        ...item,
        type: "agent-singer"
      }));

      const combinedSingers = [...singersData, ...agentSingersData];
      
      if (combinedSingers.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }

      setAllSingers(combinedSingers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllSingers();
  }, []);

  const filteredSingers = allSingers.filter(singer => {
    if (searchQuery && !singer.attributes.Name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const currentPageSingers = filteredSingers.slice((current - 1) * pageSize, current * pageSize);

  const onChange = (page) => {
    setCurrent(page);
  };

  return (
    <>
      <Container>
        <Toolbar>
          <p style={{
            fontWeight: "bold",
            textTransform: "uppercase",
            marginRight: "10px",
          }}>
            Singers
          </p>
          <SearchInput
            type="text"
            placeholder="Search singers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Toolbar>

        {noData ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
            <p>No singers available at the moment.</p>
          </div>
        ) : (
          <>
            <Content1>
              {currentPageSingers && currentPageSingers.map((singer) => (
                <div key={singer?.id}>
                  <Link
                    to={`/${singer?.type}/${singer?.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="movieTrailers-container">
                      <img 
                        src={`${API_URL}${singer?.attributes?.Poster?.data?.attributes?.url || singer?.attributes?.Poster?.data[0]?.attributes?.url}`} 
                        alt={singer?.attributes?.Name} 
                        id={singer?.id}
                      />
                      <div className="Movietrailers-overlay">
                        <p className="movieTrailers-title">{singer?.attributes?.Name}</p>
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
                  total={filteredSingers.length}
                  showSizeChanger={false}
                  pageSize={pageSize}
                />
              </ConfigProvider>
            </PaginationWrapper>
          </>
        )}
      </Container>
    </>
  )
}

export default Singer;


const Container = styled.main`
  min-height: calc(10vh - 70px);
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

