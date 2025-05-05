/* src/components/NoAccountModal.jsx */
/** 존재하지 않는 계정으로 로그인 시, 회원가입을 유도하는 모달 컴포넌트 **/

import React from 'react';
import './NoAccountModal.css'; // 스타일 시트 임포트

// NoAccountModal 컴포넌트 정의
// props: onClose (모달 닫기), onSignUpClick (회원가입 버튼 클릭 시 동작), onBackToSignInClick (로그인 화면으로 돌아가기)
const NoAccountModal = ({ onClose, onSignUpClick, onBackToSignInClick }) => {
  return (
    // 모달 전체 배경 (클릭 시 모달 닫힘)
    <div className="modal-overlay" onClick={onClose}>
      
      {/* 모달 내용 영역 (클릭 이벤트가 부모로 전파되지 않도록 차단) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* 닫기 버튼 (오른쪽 상단 '×' 버튼) */}
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* 안내 문구 제목 */}
        <h2>Sorry, We didn't recognize that account.</h2>
        
        {/* 추가 안내 문구 */}
        <p>Would you like to create an account?</p>

        {/* 구글 계정으로 회원가입 버튼 */}
        <button className="google-button" onClick={onSignUpClick}>
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google Logo" />
          <span>Sign up with Google</span>
        </button>

        {/* 로그인으로 돌아가는 링크 텍스트 */}
        <p className="signin-text">
          Back to <span className="signin-link" onClick={onBackToSignInClick}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default NoAccountModal;
