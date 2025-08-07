import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { 
  RadialBarChart, RadialBar, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { 
  FiUser, FiMic, FiFilm, FiMusic,
  FiActivity, FiClock, FiPlus, FiBarChart2 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const USERID = localStorage.getItem('UserId');
const API_URL = process.env.REACT_APP_API_URL;

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    models: 0,
    singers: 0,
    dancers: 0,
    musicians: 0,
    loading: true
  });
  const [userDetails, setUserDetails] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Mock performance data
  const mockPerformance = [
    { name: 'Views', value: 78, fill: '#FF4D4F' },
    { name: 'Engagement', value: 65, fill: '#36CFC9' },
    { name: 'New Leads', value: 89, fill: '#597EF7' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/users/${USERID}?populate[agent_models]=*&populate[agent_singers]=*&populate[agent_dancers]=*&populate[agent_musicians]=*`
        );
        
        setStats({
          models: res.data.agent_models?.length || 0,
          singers: res.data.agent_singers?.length || 0,
          dancers: res.data.agent_dancers?.length || 0,
          musicians: res.data.agent_musicians?.length || 0,
          loading: false
        });
        
        setUserDetails(res.data);
        setPerformanceData(mockPerformance);
        
        // Mock activity data
        setRecentActivity([
          {
            id: 1,
            type: 'model',
            action: 'profile_update',
            name: 'Alex Johnson',
            time: '2h ago',
            priority: 'high'
          },
          {
            id: 2,
            type: 'dancer',
            action: 'new_upload',
            name: 'Maria Garcia',
            time: '5h ago',
            priority: 'medium'
          },
          {
            id: 3,
            action: 'system',
            message: 'New feature available',
            time: '1d ago',
            priority: 'low'
          }
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <NeonDashboard>
      {/* Glass Navigation Panel */}
      <NavPanel>
        <NavHeader>
          <h2>Agent Portal</h2>
          <UserBadge>
            <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
            <UserInfo>
              <UserName>{userDetails?.username}</UserName>
              <StatusIndicator>
                <StatusDot active />
                <span>Active</span>
              </StatusIndicator>
            </UserInfo>
          </UserBadge>
        </NavHeader>
        
        <NavMenu>
          <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            <FiBarChart2 />
            <span>Overview</span>
          </NavItem>
          <NavItem active={activeTab === 'models'} onClick={() => navigateTo('/editAgentModel')}>
            <FiUser />
            <span>Models</span>
            <StatBubble>{stats.models}</StatBubble>
          </NavItem>
          <NavItem active={activeTab === 'singers'} onClick={() => navigateTo('/editAgentSinger')}>
            <FiMic />
            <span>Singers</span>
            <StatBubble>{stats.singers}</StatBubble>
          </NavItem>
          <NavItem active={activeTab === 'dancers'} onClick={() => navigateTo('/editAgentDancer')}>
            <FiFilm />
            <span>Dancers</span>
            <StatBubble>{stats.dancers}</StatBubble>
          </NavItem>
          <NavItem active={activeTab === 'musicians'} onClick={() => navigateTo('/editAgentMusicians')}>
            <FiMusic />
            <span>Musicians</span>
            <StatBubble>{stats.musicians}</StatBubble>
          </NavItem>
        </NavMenu>
      </NavPanel>

      {/* Main Content Area */}
      <DashboardContent>
        <Header>
          <h1>Dashboard Overview</h1>
          <QuickActions>
            <ActionButton neon="blue">
              <FiPlus />
              <span>New Talent</span>
            </ActionButton>
            <ActionButton neon="pink">
              <FiActivity />
              <span>View Analytics</span>
            </ActionButton>
          </QuickActions>
        </Header>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard color="purple">
            <StatIcon>
              <FiUser />
            </StatIcon>
            <StatValue>{stats.models}</StatValue>
            <StatLabel>Models</StatLabel>
            <RadialChart data={[{ value: 80 }]} color="#9C27B0" />
          </StatCard>

          <StatCard color="blue">
            <StatIcon>
              <FiMic />
            </StatIcon>
            <StatValue>{stats.singers}</StatValue>
            <StatLabel>Singers</StatLabel>
            <RadialChart data={[{ value: 65 }]} color="#2196F3" />
          </StatCard>

          <StatCard color="red">
            <StatIcon>
              <FiFilm />
            </StatIcon>
            <StatValue>{stats.dancers}</StatValue>
            <StatLabel>Dancers</StatLabel>
            <RadialChart data={[{ value: 72 }]} color="#F44336" />
          </StatCard>

          <StatCard color="green">
            <StatIcon>
              <FiMusic />
            </StatIcon>
            <StatValue>{stats.musicians}</StatValue>
            <StatLabel>Musicians</StatLabel>
            <RadialChart data={[{ value: 58 }]} color="#4CAF50" />
          </StatCard>
        </StatsGrid>

        {/* Performance Section */}
        <Section>
          <SectionHeader>
            <h2>Performance Metrics</h2>
            <ViewAll>View Detailed Reports →</ViewAll>
          </SectionHeader>
          <PerformanceChart>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                innerRadius="20%" 
                outerRadius="80%" 
                data={performanceData}
                startAngle={180} 
                endAngle={-180}
              >
                <RadialBar 
                  minAngle={15} 
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RadialBar>
              </RadialBarChart>
            </ResponsiveContainer>
          </PerformanceChart>
        </Section>

        {/* Activity Stream */}
        <Section>
          <SectionHeader>
            <h2>Recent Activity</h2>
            <FiClock size={20} />
          </SectionHeader>
          <ActivityStream>
            {recentActivity.map((item) => (
              <ActivityItem key={item.id} priority={item.priority}>
                <ActivityIcon>
                  {item.type === 'model' && <FiUser />}
                  {item.type === 'dancer' && <FiFilm />}
                  {!item.type && <FiActivity />}
                </ActivityIcon>
                <ActivityContent>
                  {item.name ? (
                    <p><strong>{item.name}</strong> - {item.action.replace('_', ' ')}</p>
                  ) : (
                    <p>{item.message}</p>
                  )}
                  <ActivityTime>{item.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityStream>
        </Section>
      </DashboardContent>
    </NeonDashboard>
  );
};

// ===== STYLED COMPONENTS =====
const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255,255,255,0.2); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,0.4); }
  100% { box-shadow: 0 0 5px rgba(255,255,255,0.2); }
`;

const NeonDashboard = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0F0F1A;
  color: #E0E0E0;
  font-family: 'Inter', sans-serif;
`;

const NavPanel = styled.div`
  width: 280px;
  background: rgba(15, 15, 26, 0.8);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 1.5rem;
`;

const NavHeader = styled.div`
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    color: #fff;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    font-weight: 600;
  }
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: url(${props => props.src}) center/cover;
  border: 2px solid #597EF7;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #fff;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#52C41A' : '#F5222D'};
  box-shadow: 0 0 10px ${props => props.active ? 'rgba(82, 196, 26, 0.5)' : 'rgba(245, 34, 45, 0.3)'};
`;

const NavMenu = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: ${props => props.active ? '#597EF7' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.active ? 'rgba(89, 126, 247, 0.1)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const StatBubble = styled.span`
  position: absolute;
  right: 1rem;
  background: #597EF7;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

const DashboardContent = styled.div`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #fff;
    font-size: 2rem;
    font-weight: 600;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  background: ${props => 
    props.neon === 'blue' ? 'rgba(89, 126, 247, 0.1)' : 
    props.neon === 'pink' ? 'rgba(255, 77, 79, 0.1)' : 
    'rgba(255, 255, 255, 0.05)'};
  color: ${props => 
    props.neon === 'blue' ? '#597EF7' : 
    props.neon === 'pink' ? '#FF4D4F' : 
    '#fff'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${props => 
      props.neon === 'blue' ? 'rgba(89, 126, 247, 0.3)' : 
      props.neon === 'pink' ? 'rgba(255, 77, 79, 0.3)' : 
      'rgba(255, 255, 255, 0.1)'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: rgba(30, 30, 45, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border-color: ${props => 
      props.color === 'purple' ? 'rgba(156, 39, 176, 0.3)' :
      props.color === 'blue' ? 'rgba(33, 150, 243, 0.3)' :
      props.color === 'red' ? 'rgba(244, 67, 54, 0.3)' :
      'rgba(76, 175, 80, 0.3)'};
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const RadialChart = styled.div`
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  opacity: 0.3;
`;

const Section = styled.div`
  background: rgba(30, 30, 45, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const ViewAll = styled.div`
  color: #597EF7;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PerformanceChart = styled.div`
  height: 300px;
  margin-top: 1rem;
`;

const ActivityStream = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 4px solid ${props => 
    props.priority === 'high' ? '#FF4D4F' : 
    props.priority === 'medium' ? '#FAAD14' : 
    '#52C41A'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.07);
    transform: translateX(5px);
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(89, 126, 247, 0.1);
  color: #597EF7;
  font-size: 1.2rem;
`;

const ActivityContent = styled.div`
  flex: 1;
  
  p {
    margin: 0;
    color: #fff;
    font-size: 0.95rem;
  }
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.3rem;
`;

export default AgentDashboard;