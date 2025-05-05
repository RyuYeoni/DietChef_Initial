/* src/pages/DietPage.jsx */
/* 식단 추전 기능 페이지 구성, 로그인하면 가장 먼저 보이는 화면 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../firebase'; // Firebase 설정 파일에서 db를 불러옵니다
import DietHeader from '../components/DietHeader';
import Footer from '../components/Footer';
import './DietPage.css';

const DietPage = () => {
  const navigate = useNavigate();  // React Router의 navigate 함수 사용

  // 사용자 진행 상태 확인 함수 (auth.js의 checkUserProgress 대체)
  const checkUserProgress = async (uid) => {
    try {
      console.log("Checking user progress for:", uid);
      const userRef = ref(db, `users/${uid}`);  // Firebase Realtime Database에서 사용자의 데이터를 읽어옵니다
      const snapshot = await get(userRef);  // 데이터를 읽어옵니다
      
      if (snapshot.exists()) {
        const userData = snapshot.val();  // 데이터를 가져옵니다
        console.log("Found user data:", userData);
        return {
          hasProfile: Boolean(userData.profileCompleted),  // 프로필이 완료되었는지 여부
          hasSurvey: Boolean(userData.surveyCompleted)     // 설문이 완료되었는지 여부
        };
      }

      console.log("No user data found");
      return { hasProfile: false, hasSurvey: false };  // 데이터가 없으면 두 조건을 false로 반환
    } catch (error) {
      console.error("Error checking user progress:", error);
      return { hasProfile: false, hasSurvey: false };  // 에러 발생 시 false 반환
    }
  };

  // useEffect 훅을 사용하여 인증 상태 변화에 따라 작업을 실행
  useEffect(() => {
    const auth = getAuth();  // Firebase 인증 객체
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { replace: true });  // 로그인하지 않은 경우 홈으로 리다이렉트
        return;
      }

      try {
        // 사용자의 진행 상태 확인
        const progress = await checkUserProgress(user.uid);

        if (!progress.hasProfile) {
          navigate("/complete-profile", { replace: true });  // 프로필을 작성하지 않았다면 프로필 작성 페이지로 이동
        } else if (!progress.hasSurvey) {
          navigate("/survey", { replace: true });  // 설문을 완료하지 않았다면 설문 페이지로 이동
        }
      } catch (error) {
        console.error("사용자 진행 상태 확인 오류:", error);
      }
    });

    return () => unsubscribe();  // 컴포넌트 언마운트 시, 인증 상태 변화 리스너를 제거
  }, [navigate]);

  // 뒤로가기 방지 (페이지를 떠나는 것을 방지)
  useEffect(() => {
    const preventBackNavigation = (e) => {
      window.history.pushState(null, null, window.location.pathname);  // 뒤로가기 방지
      e.preventDefault();  // 기본 동작 방지
    };

    window.history.pushState(null, null, window.location.pathname);  // 처음 페이지 로드 시 상태를 push
    window.addEventListener('popstate', preventBackNavigation);  // popstate 이벤트 리스너 추가

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);  // 리스너 제거
    };
  }, []);

  return (
    <div className="diet-page-container">
      <DietHeader />  {/* 헤더 컴포넌트 */}
      <div className="diet-page-content">
        <h1>식단 관련 기능 페이지</h1>
        <p>로그인 성공 후 첫 메인 페이지입니다.</p>
      </div>
      <Footer />  {/* 푸터 컴포넌트 */}
    </div>
  );
};

export default DietPage;
