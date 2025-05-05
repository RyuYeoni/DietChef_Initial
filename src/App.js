// App.js
import React, { useState, useEffect } from 'react';
import './firebase'; // Firebase 설정 파일을 import
import Header from './components/Header'; // 헤더 컴포넌트
import HeroSlider from './components/HeroSlider'; // 히어로 슬라이더 컴포넌트
import Footer from './components/Footer'; // 푸터 컴포넌트
import SignUpModal from './components/SignUpModal'; // 회원가입 모달 컴포넌트
import SignInModal from './components/SignInModal'; // 로그인 모달 컴포넌트
import NoAccountModal from './components/NoAccountModal'; // 계정 없음 모달 컴포넌트
import AlreadyHaveModal from './components/AlreadyHaveModal'; // 이미 계정이 있는 경우 모달 컴포넌트
import './App.css'; // CSS 스타일 파일
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // 라우팅을 위한 컴포넌트들
import CompleteProfile from './pages/CompleteProfile'; // 프로필 작성 페이지
import SurveyPage from './pages/SurveyPage'; // 설문 페이지
import DietPage from './pages/DietPage'; // 다이어트 페이지
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase 인증 관련 함수들

function App() {
  // 모달 상태 관리 (각 모달의 열림/닫힘 상태)
  const [showModal, setShowModal] = useState(false); // 회원가입 모달
  const [showSignInModal, setShowSignInModal] = useState(false); // 로그인 모달
  const [showNoAccountModal, setShowNoAccountModal] = useState(false); // 계정 없음 모달
  const [showAlreadyHaveModal, setShowAlreadyHaveModal] = useState(false); // 이미 계정이 있을 때 모달

  // 현재 로그인한 사용자 상태
  const [currentUser, setCurrentUser] = useState(null); // 현재 사용자 정보
  const [isLoading, setIsLoading] = useState(true); // 로딩 중인지 여부

  // Firebase 인증 상태를 모니터링하는 useEffect 훅
  useEffect(() => {
    const auth = getAuth(); // Firebase 인증 객체 가져오기
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // 인증 상태가 변경될 때마다 실행되는 함수
      setCurrentUser(user); // 사용자 상태 업데이트
      setIsLoading(false); // 로딩 상태 false로 설정 (데이터 로딩이 끝났음을 의미)
    });
    
    return () => unsubscribe(); // 컴포넌트가 언마운트될 때 인증 상태 구독 해제
  }, []); // 빈 배열을 넣어서 처음 렌더링 시 한 번만 실행

  // 각 모달을 열기 위한 함수들
  // 회원가입 모달을 여는 함수
  const openSignUpModal = () => {
    setShowSignInModal(false); // 로그인 모달 닫기
    setShowNoAccountModal(false); // 계정 없음 모달 닫기
    setShowModal(true); // 회원가입 모달 열기
  };

  // 로그인 모달을 여는 함수
  const openSignInModal = () => {
    setShowModal(false); // 회원가입 모달 닫기
    setShowNoAccountModal(false); // 계정 없음 모달 닫기
    setShowSignInModal(true); // 로그인 모달 열기
  };

  // 계정 없음 모달을 여는 함수
  const openNoAccountModal = () => {
    setShowModal(false); // 회원가입 모달 닫기
    setShowSignInModal(false); // 로그인 모달 닫기
    setShowNoAccountModal(true); // 계정 없음 모달 열기
  };

  // 이미 계정 있음 모달을 여는 함수
  const openAlreadyHaveModal = () => {
    setShowAlreadyHaveModal(true); // 이미 계정 있음 모달 열기
  };

  // 모든 모달을 닫는 함수
  const closeAllModals = () => {
    setShowModal(false); // 회원가입 모달 닫기
    setShowSignInModal(false); // 로그인 모달 닫기
    setShowNoAccountModal(false); // 계정 없음 모달 닫기
    setShowAlreadyHaveModal(false); // 이미 계정 있음 모달 닫기
  };

  // 이미 계정 있음 모달에서 로그인 모달로 이동하는 함수
  const handleGoToSignIn = () => {
    setShowAlreadyHaveModal(false); // 이미 계정 있음 모달 닫기
    setShowSignInModal(true); // 로그인 모달 열기
  };

  // 인증이 필요한 페이지에 대한 보호된 라우트 컴포넌트
  const ProtectedRoute = ({ children, requireAuth }) => {
    if (isLoading) {
      return <div className="loading-screen">Loading...</div>; // 로딩 중일 때 표시되는 화면
    }

    if (requireAuth && !currentUser) {
      // 인증이 필요한 페이지인데 로그인하지 않은 경우
      return <Navigate to="/" replace />; // 홈 페이지로 리다이렉트
    }

    return children; // 로그인한 경우에는 자식 컴포넌트를 렌더링
  };

  // 메인 페이지 컴포넌트 (헤더, 슬라이더, 푸터 및 모달 렌더링)
  const MainPage = () => (
    <>
      <Header 
        onGetStartedClick={openSignUpModal} // 'Get Started' 버튼 클릭 시 회원가입 모달 열기
        onSignInClick={openSignInModal} // 'Sign In' 버튼 클릭 시 로그인 모달 열기
        currentUser={currentUser} // 현재 로그인한 사용자 정보 전달
      />
      <main className="main-content">
        <HeroSlider onCTAClick={openSignUpModal} /> {/* HeroSlider 컴포넌트 렌더링 */}
      </main>
      <Footer /> {/* 푸터 컴포넌트 렌더링 */}
      {/* 각 모달 컴포넌트 렌더링
      회원가입 모달 (모달 닫거나, 로그인 및 이미 계정 있음으로 이동)
      로그인 모달 (모달 닫거나, 회원가입으로)
      계정 없음 모달 (모달 닫거나, 회원가입 및 로그인 모달로 이동)
      이미 계정 있음 모달 (모달 닫거나, 로그인 모달로 이동)*/}
      {showModal && <SignUpModal onClose={closeAllModals} onCreateAccountClick={openSignInModal} onShowAlreadyHaveModal={openAlreadyHaveModal} />}
      {showSignInModal && <SignInModal onClose={closeAllModals} onNoAccountClick={openNoAccountModal} onCreateAccountClick={openSignUpModal} />}
      {showNoAccountModal && <NoAccountModal onClose={closeAllModals} onSignUpClick={openSignUpModal} onBackToSignInClick={openSignInModal} />}
      {showAlreadyHaveModal && <AlreadyHaveModal onClose={closeAllModals} onGoToSignIn={handleGoToSignIn} />}
    </>
  );

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 기본 페이지 (메인 페이지) */}
          <Route path="/" element={<MainPage />} />
          {/* 인증이 필요한 페이지들 (ProtectedRoute로 감싸서 인증된 사용자만 접근 가능) */}
          <Route 
            path="/complete-profile" 
            element={
              <ProtectedRoute requireAuth={true}>
                <CompleteProfile /> {/* 프로필 작성 페이지 */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/survey" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SurveyPage /> {/* 설문 페이지 */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dietpage" 
            element={
              <ProtectedRoute requireAuth={true}>
                <DietPage /> {/* 다이어트 페이지 */}
              </ProtectedRoute>
            } 
          />
          {/* 성공 페이지로 리다이렉트 (다이어트 페이지로 이동) */}
          <Route path="/success" element={<Navigate to="/dietpage" replace />} />
          {/* 알 수 없는 경로로 접근 시 홈 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
