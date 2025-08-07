import React from 'react';
import {  Dropdown, message, Space } from 'antd';
import { ShareAltOutlined, FacebookOutlined, WhatsAppOutlined, TwitterOutlined, CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from "styled-components";
const ShareButton = ({ url, title }) => {
  const handleCopy = () => {
    message.success('Link copied to clipboard!');
  };

  const items = [
    {
        key: 'copy',
        label: (
          <CopyToClipboard text={url} onCopy={handleCopy}>
            <span><CopyOutlined /> Copy Link</span>
          </CopyToClipboard>
        ),
      },
      {
        key: 'whatsapp',
        label: (
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Space><WhatsAppOutlined /> WhatsApp</Space>
          </a>
        ),
      },
    {
      key: 'facebook',
      label: (
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Space><FacebookOutlined /> Facebook</Space>
        </a>
      ),
    },
    {
      key: 'twitter',
      label: (
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Space><TwitterOutlined /> Twitter</Space>
        </a>
      ),
    }
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
      <PlayButton>
        <ShareAltOutlined/> Share
      </PlayButton>
    </Dropdown>
  );
};

export default ShareButton;

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
    background-color: #e50914;
    color: hsl(0, 0%, 100%);
    box-shadow: #e50914 0px 5px 10px 0px;
  
  &:active {
    letter-spacing: 3px;
    background-color: #e50914;
    color: hsl(0, 0%, 100%);
    box-shadow: #e50914 0px 0px 0px 0px;
    transform: translateY(2px);
    transition: 100ms;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 12px;
  }
`;