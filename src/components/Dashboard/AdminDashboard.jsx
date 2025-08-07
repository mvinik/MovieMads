import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';
import { useNavigate } from 'react-router-dom';
import Topnav from '../TopNav/Topnav';
import Header from '../Header';
import Footer from '../Footer/Footer';
const AdminDashboard = () => {
  const USERID = localStorage.getItem('UserId');
  const API_URL = process.env.REACT_APP_API_URL;
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [totalStats, setTotalStats] = useState({
    models: 0,
    singers: 0,
    dancers: 0,
    musicians: 0,
    totalAgents: 0
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/agent-details?populate=*`);
        setAgents(response.data.data);

        // Calculate totals
        const stats = {
          models: 0,
          singers: 0,
          dancers: 0,
          musicians: 0,
          totalAgents: response.data.data.length
        };

        // We'll need to fetch details for each agent to get their counts
        // This is a simplified version - in a real app you might want a more efficient approach
        const detailsPromises = response.data.data.map(agent =>
          axios.get(`${API_URL}/api/users/${agent.attributes.users_permissions_user?.data?.id}?populate=*`)
        );

        const detailsResponses = await Promise.all(detailsPromises);

        detailsResponses.forEach(res => {
          const data = res.data;
          stats.models += data.agent_models?.length || 0;
          stats.singers += data.agent_singers?.length || 0;
          stats.dancers += data.agent_dancers?.length || 0;
          stats.musicians += data.agent_musicians?.length || 0;
        });

        setTotalStats(stats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch all agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/agent-details?populate=*`);
        setAgents(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleViewDetails = (type, id) => {
    navigate(`/agent-${type}/${id}`);
  };

  // Fetch detailed agent data when selected
  useEffect(() => {
    if (selectedAgent) {
      const fetchAgentDetails = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/api/users/${selectedAgent.attributes.users_permissions_user?.data?.id}?populate[agent_models][populate][Poster]=*&populate[agent_models][populate][Thumbnail]=*&populate[agent_models][populate][Images]=*&populate[agent_models][populate][VideoFile]=*&populate[agent_singers]=*&populate[agent_dancers]=*&populate[agent_musicians]=*&populate[agent_detail]=*`
          );
          setSelectedAgent(prev => ({
            ...prev,
            details: response.data
          }));
        } catch (error) {
          console.error("Error fetching agent details:", error);
        }
      };
      fetchAgentDetails();
    }
  }, [selectedAgent?.id, selectedCategory]);

  // Filter agents based on search term
  const filteredAgents = agents.filter(agent => {
    const agentName = agent.attributes.AgentName || '';
    const agentMobile = agent.attributes.AgentMobile || '';
    return (
      agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agentMobile.includes(searchTerm)
    );
  });

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  );

  return (<>
    <Topnav />
    <Header />
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            {sidebarCollapsed ? (
              <span className="logo-mini">AD</span>
            ) : (
              <h1 className="logo-full">
                <span className="logo-red">Admin</span> Dashboard
              </h1>
            )}
          </div>
          <button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '>' : '<'}
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="agents-list">
          <h3 className="section-title">
            Agents <span className="count-badge">{filteredAgents.length}</span>
          </h3>
          {filteredAgents.length > 0 ? (
            filteredAgents.map(agent => (
              <div
                key={agent.id}
                className={`agent-item ${selectedAgent?.id === agent.id ? 'active' : ''}`}
                onClick={() => setSelectedAgent({
                  id: agent.id,
                  attributes: agent.attributes,
                  userId: agent.attributes.users_permissions_user?.data?.id
                })}
              >
                <div className="agent-avatar">
                  {agent.attributes.AgentName.charAt(0)}
                </div>
                {!sidebarCollapsed && (
                  <div className="agent-info">
                    <h4>{agent.attributes.AgentName}</h4>
                    <p>{agent.attributes.AgentMobile || 'No mobile'}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              No agents found
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="breadcrumbs">
            {selectedAgent && (
              <>
                <span onClick={() => setSelectedAgent(null)}>Agents</span>
                <span className="divider">/</span>
                <span>{selectedAgent.attributes.AgentName}</span>
                {selectedCategory && (
                  <>
                    <span className="divider">/</span>
                    <span>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
                  </>
                )}
              </>
            )}
          </div>
          <div className="user-menu">
            <span className="username">Admin</span>
            <div className="user-avatar">
              <span>A</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="content-area">
          {selectedAgent ? (
            <>
              {!selectedCategory ? (
                <div className="agent-overview">
                  <div className="agent-profile-card">
                    <div className="profile-header">
                      <h2>{selectedAgent.attributes.AgentName}</h2>
                      <div className="profile-meta">
                        <div className="meta-item">
                          <span className="meta-label">Mobile:</span>
                          <span className="meta-value">{selectedAgent.attributes.AgentMobile || 'N/A'}</span>
                        </div>
                        {selectedAgent.details && (
                          <div className="meta-item">
                            <span className="meta-label">Email:</span>
                            <span className="meta-value">{selectedAgent.details.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="stats-section">
                    <h3 className="section-title">Application Statistics</h3>
                    <div className="stats-grid">
                      {[
                        { type: 'model', label: 'Models', count: selectedAgent.details?.agent_models?.length || 0 },
                        { type: 'singer', label: 'Singers', count: selectedAgent.details?.agent_singers?.length || 0 },
                        { type: 'dancer', label: 'Dancers', count: selectedAgent.details?.agent_dancers?.length || 0 },
                        { type: 'musician', label: 'Musicians', count: selectedAgent.details?.agent_musicians?.length || 0 }
                      ].map((stat) => (
                        <div
                          key={stat.type}
                          className="stat-card"
                          onClick={() => setSelectedCategory(stat.type)}
                        >
                          <div className="stat-content">
                            <div className="stat-value">{stat.count}</div>
                            <div className="stat-label">{stat.label}</div>
                          </div>
                          <div className="stat-icon">
                            {stat.type === 'model' && '🎭'}
                            {stat.type === 'singer' && '🎤'}
                            {stat.type === 'dancer' && '💃'}
                            {stat.type === 'musician' && '🎸'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="category-details">
                  <div className="details-header">
                    <button
                      className="back-btn"
                      onClick={() => setSelectedCategory(null)}
                    >
                      ← Back to overview
                    </button>
                    <h2>
                      {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Applications
                      <span className="badge">{selectedAgent.details?.[`agent_${selectedCategory}s`]?.length || 0}</span>
                    </h2>
                  </div>

                  <div className="applications-grid">
                    {selectedAgent.details?.[`agent_${selectedCategory}s`]?.length > 0 ? (
                      selectedAgent.details[`agent_${selectedCategory}s`].map(app => (
                        <div key={app.id} className="application-card">
                          {app.Poster?.url && (
                            <div className="app-media">
                              <img
                                src={`${API_URL}${app.Poster.url}`}
                                alt="Application poster"
                                className="app-image"
                              />
                            </div>
                          )}
                          <div className="app-content">
                            <h3 className="app-title">{app.Name || `Application #${app.id}`}</h3>
                            <div className="app-meta">
                              <span className={`status-badge ${app.Payment?.toLowerCase() || 'pending'}`}>
                                {app.Payment || 'Pending'}
                              </span>
                              {app.createdAt && (
                                <span className="date">
                                  {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="app-actions">
                              <button
                                className="view-btn"
                                onClick={() => handleViewDetails(selectedCategory, app.id)}
                              >
                                View Details
                              </button>
                              <button className="more-btn">⋮</button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        {/* <div className="empty-icon">📭</div> */}
                        <h3>No Applications Found</h3>
                        <p>This agent hasn't submitted any {selectedCategory} applications yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="welcome-screen">
              <div className="welcome-card">
                <h2> <span className="logo-red">Admin</span> Dashboard</h2>
                <p className="welcome-text">Select an agent from the sidebar to view details </p>
                <div className="summary-cards">
                  <div className="summary-card">
                    <div className="summary-value">{totalStats.totalAgents}</div>
                    <div className="summary-label">Total Agents</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{totalStats.models}</div>
                    <div className="summary-label">Total Models</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{totalStats.singers}</div>
                    <div className="summary-label">Total Singers</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{totalStats.dancers}</div>
                    <div className="summary-label">Total Dancers</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-value">{totalStats.musicians}</div>
                    <div className="summary-label">Total Musicians</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
};

export default AdminDashboard;