// import React, { useEffect, useState, useRef } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
// import { Menu, Dropdown } from "antd";
// import axios from "axios";
// const API_URL = process.env.REACT_APP_API_URL;
// const USERID = localStorage.getItem('UserId');
// function Header() {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [modelExits, setModelExits] = useState(null);
//   const [modelId, setModelId] = useState("");
//   const [agentModelExits, setAgentModelExits] = useState(false);
//   const [role, setRole] = useState("")
//   const [initial, setInitial] = useState("");
//   const menuRef = useRef(null);

//   const user = localStorage.getItem("User");
//   const jwt = localStorage.getItem("JwtToken");
//   var username;
//   if (jwt) {
//     username = true
//   }
//   else {
//     username = false
//   }

//   const handleDropdownToggle = () => {
//     setShowDropdown(!showDropdown);
//   };

//   useEffect(() => {
//     // Function to close the menu when clicking outside of it
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsMenuOpen(false);
//       }
//     };

//     // Add event listener when the component mounts
//     document.addEventListener("mousedown", handleClickOutside);

//     // Remove event listener when the component unmounts
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSignOut = () => {
//     localStorage.removeItem("User");
//     localStorage.removeItem("UserId");
//     localStorage.removeItem("JwtToken");
//     localStorage.removeItem("EmailId");
//     window.location.href = '/';
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleMenuClick = () => {
//     setIsMenuOpen(false);
//   };

//   const alreadyModelExists = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/users/${USERID}?populate[model]=*&populate[role]=*&populate[agent_models]=*`);
//       setInitial(res.data?.username);
//       setModelExits(res.data?.model);
//       setModelId(res.data.model?.id);
//       setRole(res.data?.role?.name);
//       setAgentModelExits(res?.data?.agent_models?.length > 0)
//       // console.log(agentModelExits,'models');
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   }
//   useEffect(() => {
//     if (localStorage.getItem('redirectToHome')) {
//       localStorage.removeItem('redirectToHome')
//       window.location.reload();
//     }
//     alreadyModelExists();
//   }, []);

//   const handleModelEdit = () => {
//     if (role === 'Agent') {
//       if (agentModelExits) {
//         navigate(`/editAgentModel`)
//       } else {
//         navigate('/agentModelForm')
//       }
//     } else {
//       if (modelExits) {
//         navigate(`/model/${modelId}/edit`);
//       }
//       else {
//         navigate(`/model`);
//       }
//     }
//   }

//   const dropdownMenu = (
//     <Menu>
//       {!username ? (
//         <>
//           <Menu.Item key="login" onClick={() => (window.location = `${API_URL}/api/connect/google`)}>
//             Login
//           </Menu.Item>
//         </>
//       ) : (
//         <>
//           <Menu.Item key="model" onClick={handleModelEdit}>
//             Edit Model
//           </Menu.Item>
//           <Menu.Item key="signOut" onClick={handleSignOut}>
//             SIGN<LogoutOutlined rotate={-90} style={{ fontSize: '15px', color: 'red', fontWeight: 'bold' }} />UT
//           </Menu.Item>
//         </>
//       )}
//     </Menu>
//   );

//   return (
//     <>
//       <Nav>
//         <a href="/"><Logo src="/images/Moviemads Logo.png"></Logo></a>
//         {/* <h1 style={{ color: "Red" }}>MOVIE<span style={{ color: "gold" }}>MADS</span></h1> */}
//         <>
//           <MenuToggle onClick={toggleMenu}><MenuOutlined style={{ fontSize: "24px" }} /></MenuToggle>
//           <Menu1 isOpen={isMenuOpen} ref={menuRef}>
//             <NavMenu>
//               <a onClick={() => { navigate("/"); handleMenuClick(); }}>
//                 <span>Home</span>
//               </a>
//               <a onClick={() => { navigate("/movieTrailer"); handleMenuClick(); }}>
//                 <span>Movie Trailers</span>
//               </a>
//               {/* <a onClick={() => { navigate("/shortfilms"); handleMenuClick(); }}>
//               <span>Short Films</span>
//             </a> */}
//               <a onClick={() => { navigate("/model"); handleMenuClick(); }}>
//                 <span>Artists</span>
//               </a>

//               {/* Drop down for Model */}
//               {/* <Dropdown
//   overlay={
//     <Menu>
//       <Menu.Item key="musician" onClick={() => navigate("/modelForm")}>Model</Menu.Item>
//       <Menu.Item key="agent" onClick={() => navigate("/agentModelForm")}>Agent Model</Menu.Item>
//       <Menu.Item key="singer" onClick={() => navigate("/singerForm")}>Singer</Menu.Item>
//       <Menu.Item key="dancer" onClick={() => navigate("/dancerForm")}>Dancer</Menu.Item>
//     </Menu>
//   }
//   trigger={['click']}
// >
//     <span>Artists</span>
// </Dropdown> */}


//              <a onClick={() => { navigate("/shortfilmupload"); handleMenuClick(); }}>
//               <span>Short Films</span>
//             </a> 
//               <a onClick={() => { navigate("/gallery"); handleMenuClick(); }}>
//                 <span>Gallery</span>
//               </a>
//               <a onClick={() => { navigate("/awards"); handleMenuClick(); }}>
//                 <span>Awards</span>
//               </a>
//               <a onClick={() => { navigate("/reviews"); handleMenuClick(); }}>
//                 <span>Movie Reviews</span>
//               </a>
//               <div className="profile-icon">
//                 <Dropdown overlay={dropdownMenu} trigger={['click']}>
//                   <ProfileIcon>
//                     {username ? (
//                       <ProfileInitials>{initial?.charAt(0).toUpperCase()}</ProfileInitials>
//                     ) : (
//                       <UserOutlined style={{ fontSize: '24px', color: '#e50914' }} />
//                     )}
//                   </ProfileIcon>
//                 </Dropdown>
//               </div>

//             </NavMenu>
//           </Menu1>
//         </>

//       </Nav>
//     </>
//   );
// }

// export default Header;

// const ProfileIcon = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   border:1px solid #e50914;
//   background-color: rgb(16, 16, 17);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// `;

// const ProfileInitials = styled.span`
//   font-size: 20px;
//   font-weight: bold;
//   color: #e50914;
// `;


// const MenuToggle = styled.div`
//   display: none; /* Hide toggle button by default */
//   cursor: pointer;
//   /* Show toggle button only for small screens */
//   @media (max-width: 768px) {
//     display: block;
//     padding: 10px;
//   }
// `;

// // Styles for mobile menu
// const Menu1 = styled.div`
//   display: ${(props) => (props.isOpen ? "flex" : "none")}; /* Hide or show menu based on isOpen prop */
//   flex-direction: column;
//   background: #090b13;
//   position: absolute;
  
//   top: 75px; /* Adjust according to your header height */
//   left: 0;
//   width: 100%;
//   z-index: 9;

//   /* Adjust display for desktop screens */
//   @media (min-width: 768px) {
//     display: flex; /* Always show menu for desktop screens */
//     position: static; /* Reset position for desktop screens */
//     background: transparent; /* Adjust background for desktop screens */
//     flex-direction: row; /* Display menu items horizontally for desktop screens */
//     justify-content: flex-end; /* Align menu items to the right for desktop screens */
//     width: auto; /* Adjust width for desktop screens */
//     top: auto; /* Reset top position for desktop screens */
//   }
// `;

// const Nav = styled.div`
//   height: 75px;
//   background: #090b13;
//   display: flex;
//   align-items: center;
//   padding: 0 36px;
//   overflow-x: hidden;
//   overflow-y: hidden;
//   justify-content: space-between;
//   // @media (max-width: 768px) {
//   //   height: 55px;
//   // }
// `;

// const Logo = styled.img`
//   cursor: pointer;
//   width: 150px;
//   @media (max-width: 768px) {
//     width: 130px;
//   }
// `;

// const NavMenu = styled.div`
//   display: flex;
//   flex: 1;
//   justify-content: center;
//   @media (max-width: 768px) {
//     line-height: 40px;
//     margin: 25px 0px;
//     flex-direction: column;
//   }
//   a {
//     display: flex;
//     align-items: center;
//     padding: 0 12px;

//     img {
//       height: 20px;
//     }

//     span {
//       font-size: 15px;
//       font-weight: 700;
//       opacity: 0.8;
//       letter-spacing: 1.42px;
//       text-transform: uppercase;
//       cursor: pointer;
//       position: relative;

//       &:after {
//         content: "";
//         height: 2px;
//         background:#e50914;
//         position: absolute;
//         left: 0;
//         right: 0;
//         bottom: -6px;
//         opacity: 0;
//         transform-origin: center;
//         transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
//         transform: scaleX(0);

//       }
//     }
//     &:hover {
//       span:after {
//         transform: scaleX(1);
//         opacity: 1;
//        background: #e50914;
//       }
//     }
//   }
// `;

import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const USERID = localStorage.getItem('UserId');

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [artistData, setArtistData] = useState(null);
  const [role, setRole] = useState("");
  const [initial, setInitial] = useState("");
  const menuRef = useRef(null);

  const user = localStorage.getItem("User");
  const jwt = localStorage.getItem("JwtToken");
  const username = !!jwt;


  const email = localStorage.getItem('EmailId');

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("UserId");
    localStorage.removeItem("JwtToken");
    localStorage.removeItem("EmailId");
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/users/${USERID}?populate[model]=*&populate[role]=*&populate[agent_models]=*&populate[singer]=*&populate[dancer]=*&populate[musician]=*`
      );
      
      setInitial(res.data?.username);
      setRole(res.data?.role?.name);
      
      // Determine which artist type the user has registered as
      if (res.data?.model) {
        setArtistData({ type: 'model', id: res.data.model.id });
      } else if (res.data?.agent_models?.length > 0) {
        setArtistData({ type: 'agentmodel', id: res.data.agent_models[0].id });
      } else if (res.data?.singer) {
        setArtistData({ type: 'singer', id: res.data.singer.id });
      } else if (res.data?.dancer) {
        setArtistData({ type: 'dancer', id: res.data.dancer.id });
      } else if (res.data?.musician) {
        setArtistData({ type: 'musician', id: res.data.musician.id });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('redirectToHome')) {
      localStorage.removeItem('redirectToHome');
      window.location.reload();
    }
    fetchUserData();
  }, []);

  const handleArtistEdit = () => {
    if (!artistData) {
      // If no artist profile exists, navigate to the appropriate form based on role
      if (role === 'Agent') {
        navigate('/agentModelForm');
      } else if (role === 'Singer') {
        navigate('/singerForm');
      } else if (role === 'Dancer') {
        navigate('/dancerForm');
      } else if (role === 'Musician') {
        navigate('/musicianForm');
      } else {
        navigate('/model'); // Default for models
      }
    } else {
      // Navigate to the edit page for the existing artist profile
      switch (artistData.type) {
        case 'model':
          navigate(`/model/${artistData.id}/edit`);
          break;
        case 'agentmodel':
          navigate('/agentEditAll');
          break;
        case 'singer':
          navigate(`/singer/${artistData.id}/edit`);
          break;
        case 'dancer':
          navigate(`/dancer/${artistData.id}/edit`);
          break;
        case 'musician':
          navigate(`/musician/${artistData.id}/edit`);
          break;
        default:
          navigate('/model');
      }
    }
  };

  const dropdownMenu = (
    <Menu>
      {!username ? (
        <Menu.Item key="login" onClick={() => (window.location = `${API_URL}/api/connect/google`)}>
          Login
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="edit" onClick={handleArtistEdit}>
            {artistData ? 'Edit Profile' : 'Create Profile'}
          </Menu.Item>
          {email === 'moviemadsindia@gmail.com' && (
        <Menu.Item  onClick={() => navigate('/admin-dashboard')}>
          Dashboard
        </Menu.Item>
      )}
          <Menu.Item key="signOut" onClick={handleSignOut}>
            SIGN<LogoutOutlined rotate={-90} style={{ fontSize: '15px', color: 'red', fontWeight: 'bold' }} />UT
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <>
      <Nav>
        <a href="/"><Logo src="/images/Moviemads Logo.png"></Logo></a>
        <>
          <MenuToggle onClick={toggleMenu}><MenuOutlined style={{ fontSize: "24px" }} /></MenuToggle>
          <Menu1 isOpen={isMenuOpen} ref={menuRef}>
            <NavMenu>
              <a onClick={() => { navigate("/"); handleMenuClick(); }}>
                <span>Home</span>
              </a>
              <a onClick={() => { navigate("/movieTrailer"); handleMenuClick(); }}>
                <span>Movie Trailers</span>
              </a>
              <a onClick={() => { navigate("/model"); handleMenuClick(); }}>
                <span>Artists</span>
              </a>
              {/* <a onClick={() => { navigate("/shortfilmupload"); handleMenuClick(); }}>
                <span>Short Films</span>
              </a> */}
              <a onClick={() => { navigate("/gallery"); handleMenuClick(); }}>
                <span>Gallery</span>
              </a>
              <a onClick={() => { navigate("/awards"); handleMenuClick(); }}>
                <span>Awards</span>
              </a>
              <a onClick={() => { navigate("/reviews"); handleMenuClick(); }}>
                <span>Movie Reviews</span>
              </a>
              <div className="profile-icon">
                <Dropdown overlay={dropdownMenu} trigger={['click']}>
                  <ProfileIcon>
                    {username ? (
                      <ProfileInitials>{initial?.charAt(0).toUpperCase()}</ProfileInitials>
                    ) : (
                      <UserOutlined style={{ fontSize: '24px', color: '#e50914' }} />
                    )}
                  </ProfileIcon>
                </Dropdown>
              </div>
            </NavMenu>
          </Menu1>
        </>
      </Nav>
    </>
  );
}

export default Header;

const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border:1px solid #e50914;
  background-color: rgb(16, 16, 17);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ProfileInitials = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #e50914;
`;

const MenuToggle = styled.div`
  display: none;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
    padding: 10px;
  }
`;

const Menu1 = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  background: #090b13;
  position: absolute;
  top: 75px;
  left: 0;
  width: 100%;
  z-index: 9;

  @media (min-width: 768px) {
    display: flex;
    position: static;
    background: transparent;
    flex-direction: row;
    justify-content: flex-end;
    width: auto;
    top: auto;
  }
`;

const Nav = styled.div`
  height: 75px;
  background: #090b13;
  display: flex;
  align-items: center;
  padding: 0 36px;
  overflow-x: hidden;
  overflow-y: hidden;
  justify-content: space-between;
`;

const Logo = styled.img`
  cursor: pointer;
  width: 150px;
  @media (max-width: 768px) {
    width: 130px;
  }
`;

const NavMenu = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  @media (max-width: 768px) {
    line-height: 40px;
    margin: 25px 0px;
    flex-direction: column;
  }
  a {
    display: flex;
    align-items: center;
    padding: 0 12px;

    img {
      height: 20px;
    }

    span {
      font-size: 15px;
      font-weight: 700;
      opacity: 0.8;
      letter-spacing: 1.42px;
      text-transform: uppercase;
      cursor: pointer;
      position: relative;

      &:after {
        content: "";
        height: 2px;
        background:#e50914;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        opacity: 0;
        transform-origin: center;
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        transform: scaleX(0);
      }
    }
    &:hover {
      span:after {
        transform: scaleX(1);
        opacity: 1;
       background: #e50914;
      }
    }
  }
`;