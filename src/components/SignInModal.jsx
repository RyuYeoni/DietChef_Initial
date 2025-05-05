// src/components/SignInModal.js
// 구글 로그인(Sign in with Google)을 위한 모달 컴포넌트를 정의

import React, { useState } from 'react'; // React 및 상태 관리(useState) 훅 임포트
import './SignInModal.css'; // 스타일 시트를 가져옴
import { signInWithGoogle, checkUserProgress } from "../auth"; // 사용자 로그인 및 상태 확인 함수 임포트
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅

// SignInModal 컴포넌트 정의
// props:
// - onClose: 모달 닫기 함수
// - onNoAccountClick: 계정이 없을 경우 실행할 함수 (회원가입 유도)
// - onCreateAccountClick: 'Create one' 텍스트 클릭 시 실행할 함수
const SignInModal = ({ onClose, onNoAccountClick, onCreateAccountClick }) => {
  const navigate = useNavigate(); // 페이지 이동 함수 사용
  const [isLoading, setIsLoading] = useState(false); // 로그인 중 상태를 관리하는 상태 변수

  // 구글 로그인 버튼 클릭 시 실행되는 함수
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true); // 로딩 상태 시작
      const user = await signInWithGoogle(); // Firebase로 Google 로그인 수행

      // 새 사용자 여부 판단 (계정 생성 시간과 마지막 로그인 시간이 같으면 새 사용자)
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

      if (isNewUser) {
        // 신규 사용자일 경우: 회원가입 유도 모달로 전환
        onClose(); // 현재 모달 닫기
        onNoAccountClick(); // NoAccountModal 열기
      } else {
        // 기존 사용자일 경우: 사용자의 진행 상황을 확인하여 다음 경로 결정
        console.log("Checking progress for existing user:", user.uid);
        const progress = await checkUserProgress(user.uid); // Firestore에서 진행 상태 가져오기
        console.log("User progress:", progress);

        onClose(); // 모달 닫기

        // 진행 상태에 따라 다음 페이지로 이동
        if (!progress.hasProfile) {
          // 프로필을 아직 작성하지 않은 경우
          console.log("Redirecting to complete profile");
          sessionStorage.setItem('preventBack', 'true'); // 뒤로가기를 방지하기 위한 임시 상태 설정
          navigate("/complete-profile", { replace: true }); // 프로필 작성 페이지로 이동
        } else if (!progress.hasSurvey) {
          // 프로필은 작성했지만 설문 미완료인 경우
          console.log("Redirecting to survey");
          sessionStorage.setItem('preventBack', 'true');
          navigate("/survey", { replace: true }); // 설문 페이지로 이동
        } else {
          // 모든 단계 완료 시 메인 페이지로 이동
          console.log("Redirecting to diet page");
          navigate("/dietpage", { replace: true }); // 메인 기능 페이지로 이동
        }
      }
    } catch (error) {
      // 로그인 실패 또는 사용자가 로그인 창을 닫은 경우
      console.error('Google 로그인 실패', error);
      alert('로그인에 실패했습니다. 또는 중단했습니다. *상세내용: ' + error.message);
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  // 실제 화면에 렌더링되는 JSX 부분
  return (
    // 모달의 배경 오버레이 (클릭 시 모달 닫힘)
    <div className="modal-overlay" onClick={onClose}>
      {/* 모달 콘텐츠 영역 (이 영역 클릭 시에는 닫히지 않도록 이벤트 전파 막음) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 오른쪽 위 닫기 버튼 */}
        <button className="close-button" onClick={onClose}>×</button>

        {/* 모달 타이틀 */}
        <h2>Welcome back.</h2>

        {/* 구글 로그인 버튼 */}
        <button 
          className="google-button" 
          onClick={handleGoogleSignIn} // 버튼 클릭 시 로그인 시도
          disabled={isLoading} // 로그인 중일 때는 버튼 비활성화
        >
          {/* 구글 로고 */}
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google Logo" />
          
          {/* 로그인 진행 중일 땐 "Logging in...", 아니면 기본 문구 */}
          <span>{isLoading ? "Logging in..." : "Sign in with Google"}</span>
        </button>

        {/* 계정이 없는 경우 회원가입 유도 문구 */}
        <p className="signin-text">
          No account? <span className="signin-link" onClick={onCreateAccountClick}>Create one</span>
        </p>
      </div>
    </div>
  );
};

export default SignInModal; // 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냄
