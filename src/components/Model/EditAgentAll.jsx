
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Header from '../Header';
import Footer from '../Footer/Footer';
import Topnav from '../TopNav/Topnav';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './Model.css';
import AgentEditModel from './AgentEditModel';
import AgentEditSinger from '../AgentSinger/AgentEditSinger';
import AgentEditDancer from '../AgentDancer/AgentEditDancer';
import AgentEditMusician from '../AgentMusician/AgentEditMusician';

const USERID = localStorage.getItem('UserId');
const API_URL = process.env.REACT_APP_API_URL;

const EditAgentAll = () => {
    const [agentModels, setAgentModels] = useState([]);



    const [userDetails, setUserDetails] = useState({});
    const fileInputRef = useRef(null);
    const [agentCategories, setAgentCategories] = useState({
        hasModels: false,
        hasSingers: false,
        hasDancers: false,
        hasMusicians: false,
        totalCategories: 0,
        counts: {
            singers: 0,
            dancers: 0,
            musicians: 0
        }
    });

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await axios.get(
                    // `${API_URL}/api/users/${USERID}?populate[agent_models][populate][Poster]=*&populate[agent_models][populate][Thumbnail]=*&populate[agent_models][populate][Images]=*&populate[agent_models][populate][VideoFile]=*`
                    `${API_URL}/api/users/${USERID}?populate[agent_models][populate][Poster]=*&populate[agent_models][populate][Thumbnail]=*&populate[agent_models][populate][Images]=*&populate[agent_models][populate][VideoFile]=*&populate[agent_singers]=*&populate[agent_dancers]=*&populate[agent_musicians]=*`);
                const models = res.data.agent_models || [];
                const singers = res.data.agent_singers || [];
                const dancers = res.data.agent_dancers || [];
                const musicians = res.data.agent_musicians || [];

                setAgentModels(models);

                setUserDetails(res.data);

                const categories = {
                    hasModels: models.length > 0,
                    hasSingers: singers.length > 0,
                    hasDancers: dancers.length > 0,
                    hasMusicians: musicians.length > 0,
                    totalCategories: [models, singers, dancers, musicians].filter(arr => arr.length > 0).length,
                    counts: {
                        models:models.length,
                        singers: singers.length,
                        dancers: dancers.length,
                        musicians: musicians.length
                    }
                };

                setAgentCategories(categories);



            } catch (err) {
                console.error('Error fetching agent models:', err);
            }
        };

        fetchModels();
    }, []);









    return (
        <>
            <Topnav />
            <Header />


            {/* <Title>Agent Models By <span1>{userDetails?.username}</span1></Title> */}
            <Title> Agent Categories ({agentCategories.totalCategories}) - <span1>{userDetails?.username}</span1></Title>



            {
                agentCategories.hasModels && (
                    <AgentEditModel count={agentCategories.counts.models} />
                )
            }
            {agentCategories.hasSingers && (
                <AgentEditSinger count={agentCategories.counts.singers} />
            )}

            {agentCategories.hasDancers && (
                <AgentEditDancer count={agentCategories.counts.dancers} />
            )}

            {agentCategories.hasMusicians && (
                <AgentEditMusician count={agentCategories.counts.musicians} />
            )}







            <Footer />
        </>
    );
};

export default EditAgentAll;
export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  span1{
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 30px;
    color:red;
  }
`;
const SubTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0;
  color: #333;
  border-bottom: 2px solid #c71b29;
  padding-bottom: 8px;
`;
const Container = styled.main`
  min-height: calc(100vh - 70px);
  padding: 0 calc(3.5vw + 5px);
  position: relative;
  padding-bottom: 50px;
  overflow-x: hidden;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;