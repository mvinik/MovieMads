import React, { useEffect, useState } from "react";
import "./Gallery.css";
import Modal from 'react-modal';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import axios from "axios";
import Header from '../Header';
import Footer from "../Footer/Footer";
import Topnav from "../TopNav/Topnav";


const API_URL = process.env.REACT_APP_API_URL;

const Gallery = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [pics, setPics] = useState([]);

  const openModal = (images) => {
    const formattedImages = images?.map(image => ({
      src: `${API_URL}${image.attributes.url}`,
      alt: image.attributes.name,
    }));
    setCurrentCategory(formattedImages);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const GalleryImages = async () => {
    const res = await axios.get(`${API_URL}/api/galleries?populate=*`);
    setPics(res.data.data);
    // console.log(pics, 'Gallery images')
  }

  useEffect(() => {
    GalleryImages();
  }, [])

  return (<>

    <Topnav />
    <Header />
    <div className="container">
      <div >
        <h1 className="contest-heading">
          Gallery<p style={{ fontSize: '1.5rem', padding: '0', margin: '0' }}>(Frozen Moments of Moviemads)</p>
        </h1>
      </div>

      <div style={{ alignItems: 'center', justifyItems: 'center' }} className="category-list">
        {pics.map((images, index) => (
          <div class="card1" key={index}>
            <div class="imgBx">
              <img
                className="img"
                onClick={() => openModal(images?.attributes.Images.data)}
                src={`${API_URL}${images?.attributes.Images.data[0].attributes.url}`}
                alt={images?.attributes.Category}
              />
            </div>
            <div class="details">
              <h2>{images.attributes.Category}</h2>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Carousel"
        className='ImageModal'
      >
        <span className='Esc'>press esc to close</span>
        <Carousel
          images={currentCategory}
          style={{ height: 500, maxWidth: 800, objectFit: 'cover' }}
        />
      </Modal>
    </div>
    <Footer />

  </>
  )
}

export default Gallery;

