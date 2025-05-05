/* src/components/Header.jsx */
/* 
  웹사이트 상단 헤더 영역을 구성.
  로고와 로그인/회원가입 버튼을 포함하고, 버튼 클릭 시 부모 컴포넌트로 전달된 함수들을 실행합니다.
*/

import React from 'react'; // React 라이브러리 불러오기
import './Header.css';    // 헤더에 적용할 CSS 불러오기
import logo from '../assets/images/logo.png'; // 로고 이미지 파일 임포트

const Header = ({ onGetStartedClick, onSignInClick }) => { 
  // onGetStartedClick과 onSignInClick은 부모 컴포넌트에서 전달된 함수들

  return (
    <header className="header"> {/* 헤더 영역 */}
      <img src={logo} alt="DietChef Logo" className="logo" /> {/* 로고 이미지 표시 */}
      <div className="nav-buttons"> {/* 네비게이션 버튼 그룹 */}
        <button 
          className="text-button" 
          onClick={() => {onSignInClick();}} // 로그인 버튼, 클릭 시 onSignInClick 실행
        >
          Sign in
        </button>
        <button 
          className="colored-button" 
          onClick={() => {onGetStartedClick();}} // 시작 버튼, 클릭 시 onGetStartedClick 실행
        >
          Get started 
        </button>
      </div>
    </header>
  );
};

export default Header; // Header 컴포넌트 내보내기
