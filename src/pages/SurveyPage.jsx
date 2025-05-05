/* src/pages/SurveyPage.jsx */
/* 사용자 가입시 설문조사 페이지 스타일 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SurveyPage.css'; // CSS 파일 import
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase 인증을 위한 함수들 import
import { saveSurveyData, checkUserProgress } from '../auth'; // 설문 데이터를 저장하는 함수와 사용자 진행 상태를 확인하는 함수 import

const SurveyPage = () => {
  // 설문 항목을 관리하는 상태 변수들
  const [birthday, setBirthday] = useState(''); // 생일
  const [gender, setGender] = useState(''); // 성별
  const [height, setHeight] = useState(''); // 키
  const [weight, setWeight] = useState(''); // 몸무게
  const [dietGoal, setDietGoal] = useState(''); // 다이어트 목표
  const [exerciseHours, setExerciseHours] = useState(''); // 운동 시간
  const [uid, setUid] = useState(''); // 사용자의 고유 ID (UID)
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리 (데이터 저장 중)
  const [isVerifying, setIsVerifying] = useState(true); // 사용자의 인증 상태를 확인하는 중인지 여부
  const navigate = useNavigate(); // React Router의 navigate 함수를 사용하여 페이지 이동

  // 페이지가 처음 렌더링될 때 실행되는 useEffect 훅
  useEffect(() => {
    const auth = getAuth(); // Firebase 인증 객체 가져오기
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // 사용자의 인증 상태를 실시간으로 확인
      if (user) { // 사용자가 로그인된 상태일 경우
        setUid(user.uid); // 사용자 UID 저장
        
        // 사용자 진행 상태 확인
        try {
          const progress = await checkUserProgress(user.uid); // 사용자 진행 상태 가져오기
          
          // 프로필을 작성하지 않은 사용자는 프로필 페이지로 리다이렉트
          if (!progress.hasProfile) { 
            navigate("/complete-profile", { replace: true }); // 프로필 작성 페이지로 이동
            return; // 이 후 코드 실행을 막음
          }
          
          setIsVerifying(false); // 인증 확인 완료
        } catch (error) {
          console.error("진행 상태 확인 오류:", error); // 오류 처리
          setIsVerifying(false); // 인증 확인 완료
        }
      } else { // 로그인하지 않은 상태일 경우
        navigate("/", { replace: true }); // 홈 페이지로 이동
      }
    });
    
    return () => unsubscribe(); // 컴포넌트가 언마운트될 때 Firebase 인증 상태 구독 해제
  }, [navigate]); // navigate가 변경될 때마다 실행됨

  // 페이지 새로고침이나 뒤로가기를 막기 위한 useEffect 훅
  useEffect(() => {
    const preventBack = sessionStorage.getItem('preventBack'); // 뒤로가기 방지 플래그 확인
    if (preventBack !== 'true') return; // 플래그가 없으면 바로 리턴

    // 페이지 새로고침 방지
    const preventUnload = (e) => {
      e.preventDefault(); // 기본 동작 취소
      e.returnValue = ''; // 경고 메시지 표시
      return ''; // 경고 메시지 반환
    };
    window.addEventListener('beforeunload', preventUnload); // beforeunload 이벤트 리스너 추가
    
    return () => {
      window.removeEventListener('beforeunload', preventUnload); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []); // 처음 한 번만 실행됨

  // 모든 설문 항목이 채워졌는지 확인하는 변수 (폼 검증)
  const allFilled = birthday && gender && height && weight && dietGoal && exerciseHours;

  // 설문 정보 저장 후 다이어트 페이지로 이동하는 함수
  const handleContinue = async () => {
    if (!allFilled || !uid) return; // 모든 항목이 채워지지 않았거나 UID가 없으면 실행되지 않음
    
    setIsLoading(true); // 로딩 상태로 변경
    
    try {
      // 설문 정보 객체 생성
      const surveyData = { 
        birthday, 
        gender, 
        height: parseFloat(height), // 숫자 형태로 변환
        weight: parseFloat(weight), // 숫자 형태로 변환
        dietGoal, 
        exerciseHours: parseFloat(exerciseHours), // 숫자 형태로 변환
        completedAt: new Date().toISOString()  // 설문 완료 시간을 ISO 형식으로 저장
      };
      
      const success = await saveSurveyData(uid, surveyData); // Firebase에 설문 데이터 저장
      
      if (success) { // 저장이 성공하면
        sessionStorage.removeItem('preventBack'); // 뒤로가기 방지 플래그 제거
        alert("Welcome! Feel free to enjoy your Diet :)"); // 성공 메시지
        navigate("/dietpage", { replace: true }); // 다이어트 페이지로 이동
      } else {
        throw new Error("설문 데이터 저장 실패"); // 실패 시 예외 처리
      }
    } catch (error) {
      console.error("설문 데이터 저장 중 오류 발생:", error); // 오류 출력
      alert("설문 정보 저장에 실패했습니다. 다시 시도해주세요."); // 오류 메시지
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  // 프로필 페이지로 돌아가는 함수
  const handleBackToProfile = () => {
    navigate("/complete-profile"); // 프로필 페이지로 이동
  };

  // 사용자가 인증을 완료하지 않았거나 페이지 검증 중일 때 로딩 화면 표시
  if (isVerifying) {
    return <div className="loading">Verifying user information...</div>;
  }

  return (
    <div className="survey-page-container">
      <h2>Welcome!</h2>
      <p>We have a question for you.</p>

      {/* 설문 항목 입력 섹션 */}
      <div className="row">
        <div className="column">
          <label>Birthday</label>
          <input
            type="date" // 날짜 형식 입력
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)} // 변경 시 상태 업데이트
            className="input-field"
            disabled={isLoading} // 로딩 중에는 입력 불가능
          />
        </div>
        <div className="column">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)} // 변경 시 상태 업데이트
            className="input-field"
            disabled={isLoading} // 로딩 중에는 선택 불가능
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label>Height (cm)</label>
          <input
            type="number" // 숫자 입력
            value={height}
            onChange={(e) => setHeight(e.target.value)} // 변경 시 상태 업데이트
            className="input-field"
            disabled={isLoading} // 로딩 중에는 입력 불가능
          />
        </div>
        <div className="column">
          <label>Weight (kg)</label>
          <input
            type="number" // 숫자 입력
            value={weight}
            onChange={(e) => setWeight(e.target.value)} // 변경 시 상태 업데이트
            className="input-field"
            disabled={isLoading} // 로딩 중에는 입력 불가능
          />
        </div>
      </div>

      <div className="full-width">
        <label>What is your diet goal?</label>
        <select
          value={dietGoal}
          onChange={(e) => setDietGoal(e.target.value)} // 변경 시 상태 업데이트
          className="input-field"
          disabled={isLoading} // 로딩 중에는 선택 불가능
        >
          <option value="">Select a goal</option>
          <option value="loss">Weight Loss</option>
          <option value="maintain">Maintenance</option>
          <option value="gain">Weight Gain</option>
        </select>
      </div>

      <div className="full-width">
       <label>How many hours do you exercise per week?</label>
       <input
        type="number" // 숫자 입력
        min="0" // 최소값 0
        value={exerciseHours}
        onChange={(e) => setExerciseHours(e.target.value)} // 변경 시 상태 업데이트
        className="input-field"
        disabled={isLoading} // 로딩 중에는 입력 불가능
      />
      </div>

      {/* 설문 제출 버튼 (원통형 모양) */}
      <button
        className="continue-button"
        onClick={handleContinue} // 버튼 클릭 시 설문 정보 저장 및 페이지 이동
        disabled={!allFilled || isLoading} // 모든 필드가 채워져 있고 로딩 중이 아니면 활성화
      >
        {isLoading ? "Saving..." : "Continue"} {/* 로딩 중일 경우 'Saving...' 표시 */}
      </button>
      
      {/* 프로필 페이지로 돌아가기 링크 */}
      <p className="back-link" onClick={handleBackToProfile}>
        Back to Profile
      </p>
    </div>
  );
};

export default SurveyPage;
