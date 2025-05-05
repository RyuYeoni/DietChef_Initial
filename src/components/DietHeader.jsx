/* src/components/DietHeader.jsx */
/* 
  상단 헤더를 구성.
  - 로고 이미지
  - Diet / Nutrition / Food Info / Progress 내비게이션 탭
  - 사용자 프로필 버튼 (MyPageModal 연결)
*/

import React, { useState } from 'react'; // React와 useState 훅 임포트
import './DietHeader.css'; // 스타일시트 연결
import logo from '../assets/images/logo.png'; // 로고 이미지 파일 불러오기
import userIcon from '../assets/images/userpage.png'; // 사용자 아이콘 이미지
import MyPageModal from './MyPageModal'; // 마이페이지 모달 컴포넌트 불러오기

// DietHeader 함수형 컴포넌트 정의
const DietHeader = () => {
  // 현재 선택된 탭을 저장하는 state ('diet', 'nutrition' 등 중 하나)
  const [activeTab, setActiveTab] = useState('diet');

  // 마이페이지 모달을 열지 닫을지 결정하는 state
  const [showMyPageModal, setShowMyPageModal] = useState(false);

  // 탭 버튼 클릭 시 해당 탭을 활성화 상태로 설정
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 마이페이지 아이콘 클릭 시 모달 열고 탭을 'myPage'로 설정
  const handleMyPageClick = () => {
    setActiveTab('myPage');
    setShowMyPageModal(true);
  };

  // 모달 닫는 함수 (자식 컴포넌트에서 호출됨)
  const handleCloseModal = () => {
    setShowMyPageModal(false);
  };

  return (
    <>
      {/* 헤더 전체 영역 */}
      <header className="diet-header">
        {/* 왼쪽 로고 이미지 */}
        <img src={logo} alt="DietChef Logo" className="logo" />

        {/* 오른쪽 탭 메뉴 영역 */}
        <div className="nav-tabs">
          {/* Diet 탭 버튼 */}
          <button
            // className: 기본 스타일은 'nav-tab', 선택된 탭일 경우 'active' 클래스 추가
            className={`nav-tab ${activeTab === 'diet' ? 'active' : ''}`}
            // 클릭 시 handleTabClick 함수 실행, 'diet' 탭으로 설정
            onClick={() => handleTabClick('diet')}
          >
            Diet
          </button>

          {/* Nutrition 탭 버튼 */}
          <button
            className={`nav-tab ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => handleTabClick('nutrition')}
          >
            Nutrition
          </button>

          {/* Food Info 탭 버튼 */}
          <button
            className={`nav-tab ${activeTab === 'foodInfo' ? 'active' : ''}`}
            onClick={() => handleTabClick('foodInfo')}
          >
            Food Info
          </button>

          {/* Progress 탭 버튼 */}
          <button
            className={`nav-tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => handleTabClick('progress')}
          >
            Progress
          </button>

          {/* 사용자 아이콘 버튼 (My Page) */}
          <button
            className="user-icon-button"
            onClick={handleMyPageClick} // 클릭 시 마이페이지 모달 열기
          >
            {/* 사용자 이미지 */}
            <img src={userIcon} alt="MyPage" className="user-icon-img" />
          </button>
        </div>
      </header>

      {/* 마이페이지 모달 표시 여부에 따라 조건부 렌더링 */}
      {showMyPageModal && <MyPageModal onClose={handleCloseModal} />}
    </>
  );
};

// 컴포넌트 외부에서 사용 가능하도록 export
export default DietHeader;
