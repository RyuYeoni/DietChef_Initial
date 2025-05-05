/* src/components/HeroSlider.jsx */
/* 웹페이지 히어로 영역 구성 */

import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

// 각 슬라이드에 보여질 이미지와 텍스트 정보
const slides = [
  {
    image: '/images/s1.jpg',
    title: 'Your Best\nDiet Partner',
    subtitle: 'Fuel Your Day with a Meal Plan Designed for You',
  },
  {
    image: '/images/s2.jpg',
    title: 'A Meal Plan\nJust for You',
    subtitle: 'Get Your Optimal Diet Everyday, Only for You',
  },
  {
    image: '/images/s3.jpg',
    title: 'Track Diet,\nAchieve More',
    subtitle: 'Keep track of and manage your diet efficiently',
  },
  {
    image: '/images/s4.jpg',
    title: 'What Did You\nEat Today?',
    subtitle: 'Discover and Track Your Nutrition and Foods',
  },
];

// HeroSlider 컴포넌트
const HeroSlider = ({ onCTAClick }) => {
  const [index, setIndex] = useState(0); // 현재 슬라이드 인덱스 상태

  // 4초마다 자동으로 슬라이드 넘기기
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length); // 마지막에서 처음으로 순환
    }, 4000);
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 점(dot) 클릭 시 해당 슬라이드로 이동
  const handleDotClick = (i) => {
    setIndex(i); // 클릭한 점의 인덱스로 슬라이드 변경
  };

  // 제목 문자열에 포함된 \n을 기준으로 줄바꿈 처리
  const formatTitle = (title) => {
    return title.split('\n').map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="hero">
      {/* 왼쪽: 이미지 영역 */}
      <div className="hero-left">
        <img src={slides[index].image} alt={`slide ${index + 1}`} /> {/* 현재 인덱스의 이미지 표시 */}
        {/* 하단 점 네비게이션 */}
        <div className="dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? 'active' : ''}`} // 현재 인덱스만 활성화 스타일
              onClick={() => handleDotClick(i)} // 점 클릭 시 해당 슬라이드로 이동
            ></span>
          ))}
        </div>
      </div>

      {/* 오른쪽: 텍스트 및 버튼 영역 */}
      <div className="hero-right">
        <h1>{formatTitle(slides[index].title)}</h1> {/* 제목 출력 */}
        <p>{slides[index].subtitle}</p> {/* 부제목 출력 */}
        {/* 회원가입 모달 열기 버튼 */}
        <button className="cta-button" onClick={onCTAClick}>
          Find Your Perfect Diet
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
