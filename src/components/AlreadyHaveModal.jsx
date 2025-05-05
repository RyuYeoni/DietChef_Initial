/* src/components/AlreadyHaveModal.jsx */
/* Signup 버튼을 눌렀으나 이미 계정이 있는 경우 나타나는 모달 컴포넌트 */

import React from 'react';
import './AlreadyHaveModal.css'; // 모달에 대한 CSS 스타일 불러오기

// AlreadyHaveModal 컴포넌트 정의
// props:
// - onClose: 모달 닫기 함수
// - onGoToSignIn: Sign in 화면으로 이동하는 함수
const AlreadyHaveModal = ({ onClose, onGoToSignIn }) => {
  return (
    // 모달 바깥쪽 오버레이 (클릭 시 모달 닫힘)
    <div className="modal-overlay" onClick={onClose}>
      
      {/* 모달 내부 영역 (클릭 이벤트 버블링 방지) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* 오른쪽 위 닫기 버튼 */}
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* 모달 제목 */}
        <h2>You already have an account</h2>
        
        {/* Sign in 유도 문구 */}
        <p className="signin-text">
          Go to <span className="signin-link" onClick={onGoToSignIn}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default AlreadyHaveModal; // 모듈 내보내기
