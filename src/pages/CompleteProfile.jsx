/* src/pages/CompleteProfile.jsx */
/* 사용자 계정 생성 첫 페이지 구성 */

import React, { useState, useEffect } from 'react';
import './CompleteProfile.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveProfileData } from '../auth';

const CompleteProfile = () => {
  // 상태 변수 정의
  const [fullName, setFullName] = useState('');  // 사용자 이름
  const [email, setEmail] = useState('');  // 사용자 이메일
  const [uid, setUid] = useState('');  // Firebase UID
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
  const navigate = useNavigate();  // navigate hook

  // 로그인 상태 확인 및 사용자 정보 설정
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 로그인 된 사용자가 있으면 사용자 정보를 설정
        setEmail(user.email);
        setUid(user.uid);
      } else {
        // 로그인하지 않은 사용자는 홈으로 리다이렉트
        navigate("/", { replace: true });
      }
    });
    
    // 컴포넌트가 unmount될 때 리스너 제거
    return () => unsubscribe();
  }, [navigate]);

  // 페이지 이탈 방지 처리 (뒤로가기 방지)
  useEffect(() => {
    const preventBack = sessionStorage.getItem('preventBack');
    
    if (preventBack !== 'true') {
      // 홈으로 잘못 접근한 경우 리다이렉트
      navigate('/', { replace: true });
      return;
    }

    // 뒤로가기 눌렀을 때 페이지 이탈 방지
    const preventUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';  // 기본 동작을 취소
      return '';  // 경고창을 띄우기 위한 리턴 값
    };
    
    // 페이지 이탈 이벤트 리스너 추가
    window.addEventListener('beforeunload', preventUnload);
    
    // 컴포넌트 unmount 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [navigate]);

  // 계정 생성 버튼 클릭 시 호출되는 함수
  const handleCreateAccount = async () => {
    if (!fullName || !uid) return;  // 필수 입력 항목이 없으면 함수 종료
    
    setIsLoading(true);  // 로딩 상태 활성화
    
    try {
      // 프로필 정보를 Firebase에 저장
      const profileData = { 
        fullName, 
        email,
        createdAt: new Date().toISOString()  // 프로필 생성일 기록
      };
      
      // Firebase에 프로필 저장
      const success = await saveProfileData(uid, profileData);
      
      if (success) {
        // 프로필 저장 성공 시 설문조사 페이지로 이동
        navigate("/survey");
      } else {
        throw new Error("프로필 저장 실패");  // 저장 실패 시 오류 처리
      }
    } catch (error) {
      console.error("프로필 저장 중 오류 발생:", error);
      alert("프로필 정보 저장에 실패했습니다. 다시 시도해주세요.");  // 실패 알림
    } finally {
      setIsLoading(false);  // 로딩 상태 비활성화
    }
  };
  
  return (
    <div className="complete-profile-container">
      <h2>Almost there!<br /><span>Finish creating your account.</span></h2>
      
      {/* 이름 입력 필드 */}
      <div className="input-group">
        <label>Your full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}  // 입력값이 변경될 때 상태 업데이트
          disabled={isLoading}  // 로딩 중일 때는 입력 비활성화
        />
      </div>
      
      {/* 이메일 입력 필드 (읽기 전용) */}
      <div className="input-group">
        <label>Your email</label>
        <input type="text" value={email} readOnly />
      </div>
      
      {/* 계정 생성 버튼 */}
      <button
        className="create-account-button"
        onClick={handleCreateAccount}  // 버튼 클릭 시 계정 생성 처리 함수 호출
        disabled={!fullName || isLoading}  // 이름이 비어있거나 로딩 중일 때는 비활성화
      >
        {isLoading ? "Creating..." : "Create Account"} 
      </button>
    </div>
  );
};

export default CompleteProfile;
