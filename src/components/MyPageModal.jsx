/* src/components/MyPageModal.jsx */
/* 사용자 프로필 수정 및 관리, 로그아웃, 계정 삭제 기능을 제공하는 모달 */


import React, { useState, useEffect } from 'react';
import './MyPageModal.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase';

const MyPageModal = ({ onClose }) => {
  // 사용자 데이터를 상태로 관리하는 useState 훅을 사용하여 기본값을 설정합니다.
  const [userData, setUserData] = useState({
    profile: { fullName: '' }, // 사용자 이름
    survey: { // 설문 정보
      birthday: '',
      gender: '',
      height: '',
      weight: '',
      dietGoal: '',
      exerciseHours: ''
    },
    email: '' // 이메일
  });

  const [loading, setLoading] = useState(true); // 데이터 로딩 상태를 관리하는 상태 변수
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부를 관리하는 상태 변수
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const auth = getAuth(); // Firebase 인증 객체를 가져옵니다.

  useEffect(() => {
    // 컴포넌트가 마운트될 때 사용자 데이터를 Firebase에서 가져오는 비동기 함수
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; // 현재 로그인한 사용자를 가져옵니다.
        
        if (!user) {
          navigate('/'); // 사용자가 로그인하지 않은 상태라면, 로그인 페이지로 이동
          return;
        }
        
        // Firebase 실시간 데이터베이스에서 해당 사용자의 데이터를 가져옵니다.
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const dbData = snapshot.val();
          
          // Firebase에서 받은 데이터를 상태에 설정
          setUserData({
            profile: dbData.profile || { fullName: user.displayName || '' },
            survey: dbData.survey || {
              birthday: '',
              gender: '',
              height: '',
              weight: '',
              dietGoal: '',
              exerciseHours: ''
            },
            email: user.email || '',
            uid: user.uid
          });
        } else {
          // 데이터베이스에 데이터가 없을 경우, 기본값을 설정
          setUserData({
            profile: { fullName: user.displayName || '' },
            survey: {
              birthday: '',
              gender: '',
              height: '',
              weight: '',
              dietGoal: '',
              exerciseHours: ''
            },
            email: user.email || '',
            uid: user.uid
          });
        }
        
        setLoading(false); // 데이터 로딩 완료
      } catch (error) {
        console.error("사용자 데이터 로드 오류:", error); // 에러 발생 시 콘솔에 에러 메시지 출력
        setLoading(false); // 로딩 상태 종료
      }
    };
    
    fetchUserData(); // 사용자 데이터를 가져오는 함수 호출
  }, [auth, navigate]); // auth나 navigate가 변경되면 다시 실행

  // 입력값 변경 처리 함수: 사용자가 입력한 값을 상태에 반영합니다.
  const handleInputChange = (section, field, value) => {
    setUserData(prevData => ({
      ...prevData, // 기존 상태를 유지하면서 변경된 부분만 업데이트
      [section]: {
        ...prevData[section], // 해당 섹션만 업데이트
        [field]: value // 입력된 값으로 해당 필드 업데이트
      }
    }));
  };

  // 폼 유효성 검사 함수: 모든 필드가 채워졌는지 확인합니다.
  const validateForm = () => {
    const { profile, survey } = userData;
    return (
      profile.fullName &&
      survey.birthday &&
      survey.gender &&
      survey.height &&
      survey.weight &&
      survey.dietGoal &&
      survey.exerciseHours
    );
  };

  // 저장 버튼을 클릭했을 때 실행되는 함수
  const handleSave = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      
      // Firebase 실시간 데이터베이스에서 사용자 데이터를 가져옵니다.
      const userRef = ref(db, `users/${userData.uid}`);
      const snapshot = await get(userRef);
      
      // 기존 데이터가 있으면 불러오고, 없으면 빈 객체로 설정
      const existingData = snapshot.exists() ? snapshot.val() : {};
      
      // 새로운 데이터를 업데이트할 객체로 생성
      const updatedData = {
        ...existingData, // 기존 데이터 유지
        profile: userData.profile, // 프로필 정보 업데이트
        profileCompleted: true, // 프로필 완료 표시
        survey: userData.survey, // 설문 정보 업데이트
        surveyCompleted: true, // 설문 완료 표시
        updatedAt: new Date().toISOString() // 마지막 수정 시간
      };
      
      // Firebase에 업데이트된 데이터를 저장
      await set(userRef, updatedData);
      
      setIsEditing(false); // 편집 모드 종료
      alert('Information saved successfully.'); // 저장 완료 메시지
    } catch (error) {
      console.error("정보 저장 오류:", error); // 저장 중 에러 발생 시 콘솔 출력
      alert("Failed to save information."); // 저장 실패 메시지
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase에서 로그아웃 수행
      navigate('/'); // 홈 페이지로 이동
    } catch (error) {
      console.error("로그아웃 오류:", error); // 로그아웃 중 에러 발생 시 콘솔 출력
      alert("Failed to log out."); // 로그아웃 실패 메시지
    }
  };

  // 계정 삭제 처리 함수
  const handleDeleteAccount = async () => {
    // 계정 삭제 전에 확인 메시지 표시
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return; // 확인하지 않으면 함수 종료
    
    try {
      const user = auth.currentUser; // 현재 로그인된 사용자 가져오기
      
      if (user) {
        // 사용자 데이터 삭제 (선택적)
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, null);
        
        // Firebase에서 계정 삭제
        await deleteUser(user);
        navigate('/'); // 홈 페이지로 이동
      } else {
        throw new Error("로그인된 사용자가 없습니다."); // 로그인된 사용자가 없으면 에러 발생
      }
    } catch (error) {
      console.error("계정 삭제 오류:", error); // 계정 삭제 중 에러 발생 시 콘솔 출력
      alert("Failed to delete account. Please log in again and try."); // 계정 삭제 실패 메시지
    }
  };

  // 로딩 중일 때 반환할 UI
  if (loading) {
    return <div className="modal-overlay">
      <div className="modal-content">
        <p>Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mypage-modal" onClick={(e) => e.stopPropagation()}>
        {/* 모달 닫기 버튼 */}
        <button className="close-button" onClick={onClose}>×</button>
        <h2>User Info</h2>
        
        <div className="user-info-section">
          {/* 사용자 정보 수정 폼 */}
          <div className="info-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={userData.profile.fullName}
              onChange={(e) => handleInputChange('profile', 'fullName', e.target.value)} // 이름 변경
              readOnly={!isEditing} // 편집 모드에서만 수정 가능
              className={isEditing ? 'editable' : ''} // 편집 모드에만 스타일 적용
            />
          </div>
          
          <div className="info-group">
            <label>Email</label>
            <input type="email" value={userData.email} readOnly /> {/* 이메일은 수정 불가 */}
          </div>
          
          <div className="info-group">
            <label>Birthday</label>
            <input 
              type="date" 
              value={userData.survey.birthday}
              onChange={(e) => handleInputChange('survey', 'birthday', e.target.value)} // 생일 변경
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
          
          <div className="info-group">
            <label>Gender</label>
            <select 
              value={userData.survey.gender}
              onChange={(e) => handleInputChange('survey', 'gender', e.target.value)} // 성별 변경
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="info-group">
            <label>Height (cm)</label>
            <input 
              type="number" 
              value={userData.survey.height}
              onChange={(e) => handleInputChange('survey', 'height', e.target.value)} // 키 변경
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
          
          <div className="info-group">
            <label>Weight (kg)</label>
            <input 
              type="number" 
              value={userData.survey.weight}
              onChange={(e) => handleInputChange('survey', 'weight', e.target.value)} // 몸무게 변경
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
          
          <div className="info-group">
            <label>Diet Goal</label>
            <select 
              value={userData.survey.dietGoal}
              onChange={(e) => handleInputChange('survey', 'dietGoal', e.target.value)} // 다이어트 목표 변경
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
            >
              <option value="">Select Goal</option>
              <option value="loss">Weight Loss</option>
              <option value="maintain">Maintenance</option>
              <option value="gain">Weight Gain</option>
            </select>
          </div>
          
          <div className="info-group">
            <label>Exercise Hours (per week)</label>
            <input 
              type="number" 
              value={userData.survey.exerciseHours}
              onChange={(e) => handleInputChange('survey', 'exerciseHours', e.target.value)} // 운동 시간 변경
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
        </div>
        
        <div className="action-buttons">
          {/* 저장 및 취소 버튼 */}
          {isEditing ? (
            <>
              <button 
                className="save-button"
                onClick={handleSave}
                disabled={!validateForm()} // 폼 유효성 검사 후 저장 버튼 활성화
              >
                Save
              </button>
              <button 
                className="cancel-button"
                onClick={() => setIsEditing(false)} // 편집 취소 버튼
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)} // 편집 모드로 전환 버튼
            >
              Edit
            </button>
          )}
          
          <div className="account-links">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            
            <button className="delete-account-button" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageModal;