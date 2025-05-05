/* src/components/Footer.jsx */
/* 
  웹사이트 하단에 들어가는 푸터 영역.
  현재는 스타일만 적용되어 있으며 내용은 비어 있습니다.
*/

import React from 'react'; // React 라이브러리 불러오기
import './Footer.css';    // 푸터에 적용할 CSS 불러오기

// Footer 함수형 컴포넌트 정의
const Footer = () => {
  return (
    // footer HTML 태그를 사용하고, className으로 스타일 연결
    <footer className="footer"></footer>
  );
};

// 외부에서 사용할 수 있도록 컴포넌트 export
export default Footer;
