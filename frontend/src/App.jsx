import React from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import PersonalInfo from "./pages/PersonalInfo/PersonalInfo";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import UserProfile from "./pages/UserProfile/UserProfile";
import Documents from "./pages/Documents/Documents";
import Feed from "./pages/Feed/Feed";
import DashBoard from "./pages/AdminDashBoard/DashBoard";
import UnderReview from "./pages/UnderReview/UnderReview";
import ProfilesForAdmin from "./pages/ProfilesForAdmin";
import NotFound from "./pages/NotFound/NotFound";
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path='/feed' element={<Feed />} />
        <Route path='/' element={<Home />} />
        <Route path='/admin-dashboard' element={<DashBoard />} />
        <Route path='/profile/:id' element={<UserProfile />} />
        <Route path='/personal-info' element={<PersonalInfo />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/email-verification' element={<EmailVerification />} />
        <Route path='/document-verification' element={<Documents />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/profile/:id' element={<ProfilesForAdmin />} />
        <Route path='/profile-under-review' element={<UnderReview />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
