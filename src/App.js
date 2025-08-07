import React from "react";
import "./App.css";
import Home from "./components/Home";
import Details from "./components/Details";
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import MovieTrailers from "./components/MovieTrailers/MovieTrailers";
import ShortFilms from "./components/ShortFilms/ShortFilms";
import Awards from "./components/Awards/Awards";
import Reviews from "./components/Reviews/Reviews";
import Contest from "./components/Contest/Contest";
import GoogleAuthCallback from "./components/GoogleAuthCallback";
import ReviewInfo from "./components/Reviews/ReviewInfo";
import Blogs from "./components/Blogs/Blogs";
import TermsAndCondition from "./components/TermsAndCondition";
import Contact from "./components/Contact";
import Model from "./components/Model/Model";
import ModelDetails from "./components/Model/ModelDetails";
import ModelForm from "./components/Model/ModelForm";
import Gallery from "./components/Gallery/Gallery";
import EditModel from "./components/Model/EditModel";
import PageNotFound from "./components/PageNotFound";
import Keywords from "./components/Keywords";
import AgentForm from "./components/Model/AgentForm";
import AgentEditModel from "./components/Model/AgentEditModel";
import AgentModelDetails from "./components/Model/AgentModelDetails";
import ShortDetails from "./components/ShortFilms/ShortDetails";
import ShortFilmPlayer from "./components/ShortFilms/ShortFilmChecking";
import ShortFilmUpload from "./components/ShortFilms/ShortFilmUpload";
import DancerDetails from "./components/Dancer/DancerDetails";
import SingerDetails from "./components/Singer/SingerDetails";
import EditSinger from "./components/Singer/EditSinger";
import EditDancer from "./components/Dancer/EditDancer";
import SingerForm from "./components/Singer/SingerForm";
import DancerForm from "./components/Dancer/DancerForm";
import MusicianForm from "./components/Musician/MusicianForm";
import EditMusician from "./components/Musician/EditMusician";
import UploadForm from "./components/ShortFilms/UploadForm";
import MusicianDetails from "./components/Musician/MusicianDetails";
import AgentSingerForm from "./components/AgentSinger/AgentSingerForm";
import AgentSingerDetails from "./components/AgentSinger/AgentSingerDetails";
import AgentEditSinger from "./components/AgentSinger/AgentEditSinger";
import AgentDancerForm from "./components/AgentDancer/AgentDancerForm";
import AgentDancerDetails from "./components/AgentDancer/AgentDancerDetails";
import AgentEditDancer from "./components/AgentDancer/AgentEditDancer";
import AgentMusicianForm from "./components/AgentMusician/AgentMusicianForm";
import AgentMusicianDetails from "./components/AgentMusician/AgentMusicianDetails";
import AgentEditMusician from "./components/AgentMusician/AgentEditMusician";
import AgentDashboard from "./components/Dashboard/AgentDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EditAgentAll from "./components/Model/EditAgentAll";
import PrivateAdminRoute from "./components/Dashboard/PrivateAdminRoute";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  // const isLoginPage = location.pathname === '/login';
  const user = localStorage.getItem("User");
  const jwt = localStorage.getItem("JwtToken");

  // return !jwt?(
  //   <>
  //      <Header />
  //      <Routes>
  //     <Route path="/login" element={<Login />} />
  //     <Route path='/' element={<Navigate to={'/login' } />} />
  //     <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
  //   </Routes>
  //   </>
  // ):

  return (
    <>
      <Routes>
        {!jwt ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/modelForm" element={<Login />} />
            <Route path="/contest" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            <Route path="/" element={<Home />} />
            <Route path="/shortflimDetails/:id" element={<ShortDetails />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/details/movieTrailer/:id" element={<Details />} />
            <Route path="/details/review/:id" element={<Details />} />
            <Route path="/review/:id" element={<ReviewInfo />} />
            <Route path="/movieTrailer" element={<MovieTrailers />} />
            <Route path="/shortFilms" element={<ShortFilms />} />
            <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/model" element={<Model />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/model/:id" element={<ModelDetails />} />
            <Route path="/agent-model/:id" element={<AgentModelDetails />} />
            <Route path="/model/:id/edit" element={<EditModel />} />
            <Route path="/editAgentModel" element={<AgentEditModel />} />
            <Route path="/keywords" element={<Keywords />} />
            <Route path="/shortfilmplayer/:id" element={<ShortFilmPlayer />} />
            <Route path='/shortfilmupload' element={<ShortFilmUpload />} />
               <Route path="/agent-dancer/:id" element={<AgentDancerDetails />} />
                 <Route path="/agent-singer/:id" element={<AgentSingerDetails />} />
                  <Route path="/agent-musician/:id" element={<AgentMusicianDetails />} />
          </>
        ) : (
          <>
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/details/movieTrailer/:id" element={<Details />} />
            <Route path="/details/review/:id" element={<Details />} />
            <Route path="/review/:id" element={<ReviewInfo />} />
            <Route path="/movieTrailer" element={<MovieTrailers />} />
            <Route path="/shortFilms" element={<ShortFilms />} />
            <Route path="/shortflimDetails/:id" element={<ShortDetails />} />
            <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contest" element={<Contest />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/model" element={<Model />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/modelForm" element={<ModelForm />} />
            <Route path="/agentModelForm" element={<AgentForm />} />
            <Route path="/model/:id" element={<ModelDetails />} />
            <Route path="/agent-model/:id" element={<AgentModelDetails />} />
            <Route path="/model/:id/edit" element={<EditModel />} />
            <Route path="/editAgentModel" element={<AgentEditModel />} />
            <Route path="/dancer/:id" element={<DancerDetails />} />
            <Route path="/singer/:id" element={<SingerDetails />} />
            <Route path="/musician/:id" element={<MusicianDetails />} />
            <Route path="/dancer/:id/edit" element={<EditDancer />} />
            <Route path="/singer/:id/edit" element={<EditSinger />} />
            <Route path="/musician/:id/edit" element={<EditMusician />} />
            <Route path="/singerForm" element={<SingerForm />} />
            <Route path="/agentSingerForm" element={<AgentSingerForm />} />
            <Route path="/agent-singer/:id" element={<AgentSingerDetails />} />
            <Route path="/editAgentSinger" element={<AgentEditSinger />} />
            <Route path="/agentDancerForm" element={<AgentDancerForm />} />
            <Route path="/agent-dancer/:id" element={<AgentDancerDetails />} />
            <Route path="/editAgentDancer" element={<AgentEditDancer />} />
            <Route path="/agentMusicianForm" element={<AgentMusicianForm />} />
            <Route path="/agent-musician/:id" element={<AgentMusicianDetails />} />
            <Route path="/editAgentMusician" element={<AgentEditMusician />} />
            <Route path="/dancerForm" element={<DancerForm />} />
            <Route path="/musicianForm" element={<MusicianForm />} />
            <Route path="/keywords" element={<Keywords />} />
            <Route path="/shortfilmplayer/:id" element={<ShortFilmPlayer />} />
            <Route path='/shortfilmupload' element={<ShortFilmUpload />} />
            <Route path='/shortfilmuploadForm' element={<UploadForm />} />
            <Route path='/agentDashboard' element={<AgentDashboard />} />
            <Route path='/adminDashboard' element={<AdminDashboard />} />
             <Route path='/agentEditAll' element={<EditAgentAll />} />
             <Route
  path="/admin-dashboard"
  element={
   <PrivateAdminRoute>
      <AdminDashboard />
    </PrivateAdminRoute>
  }
/>

          </>
        )}

      </Routes>
    </>
  );
}

export default App;
