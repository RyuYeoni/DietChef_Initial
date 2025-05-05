// src/components/SignUpModal.jsx
// 구글 로그인(Sign up with Google)을 위한 모달 컴포넌트를 정의

import React, { useState } from 'react'; // React와 useState 훅을 임포트
import './SignUpModal.css'; // 모달의 스타일을 임포트
import { signInWithGoogle, checkUserProgress } from "../auth"; // 구글 로그인과 사용자 진행 상태 확인 함수 임포트
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 임포트

// SignUpModal 컴포넌트 정의
const SignUpModal = ({ onClose, onCreateAccountClick, onShowAlreadyHaveModal }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 사용
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  // 구글로 회원가입 처리 함수
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true); // 로딩 상태를 true로 설정
      const user = await signInWithGoogle(); // 구글로 로그인 진행

      // 로그인 후 사용자 진행 상태 확인
      console.log("Checking progress after signup for user:", user.uid);
      const progress = await checkUserProgress(user.uid); // 진행 상태 확인
      console.log("User progress:", progress);

      onClose(); // 모달 닫기

      // 모든 단계를 완료한 사용자는 이미 계정이 있다고 알림
      if (progress.hasProfile && progress.hasSurvey) {
        onShowAlreadyHaveModal(); // 이미 계정이 있다는 모달을 보여줌
        return;
      }

      // 프로필 작성을 완료하지 않은 사용자
      if (!progress.hasProfile) {
        console.log("Redirecting to complete profile");
        sessionStorage.setItem('preventBack', 'true'); // 뒤로 가기 방지
        navigate("/complete-profile", { replace: true }); // 프로필 작성 페이지로 이동
        return;
      }

      // 프로필은 있지만 설문을 완료하지 않은 사용자
      if (!progress.hasSurvey) {
        console.log("Redirecting to survey");
        sessionStorage.setItem('preventBack', 'true'); // 뒤로 가기 방지
        navigate("/survey", { replace: true }); // 설문 페이지로 이동
        return;
      }
    } catch (error) {
      console.error('Google 회원가입 실패', error); // 오류 발생 시 콘솔에 출력
      alert('회원가입에 실패했습니다. 또는 중단했습니다. *상세내용: ' + error.message); // 오류 메시지 알림
    } finally {
      setIsLoading(false); // 로딩 상태를 false로 설정
    }
  };

  // 컴포넌트 JSX 반환
  return (
    // 모달 배경: 모달의 외부 영역을 나타내며, 클릭 시 모달을 닫도록 설정
    <div className="modal-overlay" onClick={onClose}>
      {/* 모달 내용: 모달의 실제 콘텐츠가 들어있는 부분. 클릭 시 클릭 이벤트가 전달되지 않도록 방지 */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 모달 닫기 버튼: 사용자가 모달을 닫을 수 있도록 '×' 버튼을 배치 */}
        <button className="close-button" onClick={onClose}>×</button>
  
        {/* 모달 제목: "Join DietChef." 텍스트 */}
        <h2>Join DietChef.</h2>
  
        {/* 구글 회원가입 버튼: 사용자가 구글 계정을 이용해 회원가입을 할 수 있도록 제공 */}
        <button 
          className="google-button" // 버튼 스타일 클래스
          onClick={handleGoogleSignUp} // 버튼 클릭 시 handleGoogleSignUp 함수 호출
          disabled={isLoading} // isLoading이 true일 때 버튼 비활성화 (로딩 중일 때는 클릭 방지)
        >
          {/* 구글 로고 이미지: 구글 로그인 버튼 옆에 구글 아이콘을 표시 */}
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google Logo" />
  
          {/* 버튼 텍스트: 로딩 중이면 "Processing...", 아니면 "Sign up with Google" 텍스트 표시 */}
          <span>{isLoading ? "Processing..." : "Sign up with Google"}</span> 
          {/* isLoading이 true일 때 "Processing..."으로, 아니면 기본 텍스트로 표시 */}
        </button>
  
        {/* 이미 계정이 있는 경우: "이미 계정이 있나요?" 텍스트와 함께 로그인 페이지로 이동할 수 있는 링크 */}
        <p className="signin-text">
          Already have an account? {/* 계정이 있으면 로그인 화면으로 이동 */}
          {/* 로그인 페이지로 이동하는 링크: 클릭 시 onCreateAccountClick 함수 호출 */}
          <span className="signin-link" onClick={onCreateAccountClick}>Sign in</span>
        </p>
      </div>
    </div>
  );  
};

export default SignUpModal;
