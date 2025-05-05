// auth.js

// Firebase에서 제공하는 signInWithPopup을 사용하여 Google 로그인 처리
import { signInWithPopup } from "firebase/auth";
// Firebase Realtime Database에서 데이터를 읽고 쓰는 함수들
import { ref, get, set } from "firebase/database";
// firebase.js에서 설정한 auth(인증)과 googleProvider(구글 로그인 제공자), db(데이터베이스) 객체 임포트
import { auth, googleProvider, db } from "./firebase";

// 사용자가 프로필과 설문을 완료했는지 확인하는 함수
export const checkUserProgress = async (uid) => {
  try {
    console.log("Checking user progress for:", uid);  // 진행 상태 확인할 사용자 ID 출력
    const userRef = ref(db, `users/${uid}`);  // 사용자 데이터를 가져오기 위한 참조 (path: users/{uid})
    const snapshot = await get(userRef);  // 데이터베이스에서 해당 사용자 데이터를 가져옴
    
    if (snapshot.exists()) {  // 데이터가 존재하면
      const userData = snapshot.val();  // 사용자 데이터를 객체로 받아옴
      console.log("Found user data:", userData);  // 찾은 사용자 데이터 출력
      // 사용자의 프로필 완료 여부와 설문 완료 여부를 반환
      return {
        hasProfile: Boolean(userData.profileCompleted),  // 프로필 완료 여부
        hasSurvey: Boolean(userData.surveyCompleted)  // 설문 완료 여부
      };
    }
    
    console.log("No user data found");  // 데이터가 없다면
    // 사용자 데이터가 없으면 기본값 {hasProfile: false, hasSurvey: false} 반환
    return { hasProfile: false, hasSurvey: false };
  } catch (error) {
    console.error("Error checking user progress:", error);  // 에러 발생 시 로그 출력
    // 에러 발생 시 기본값 반환
    return { hasProfile: false, hasSurvey: false };
  }
};

// 사용자 프로필 데이터를 Realtime Database에 저장하는 함수
export const saveProfileData = async (uid, profileData) => {
  try {
    console.log("Saving profile data for:", uid, profileData);  // 저장할 사용자 ID와 프로필 데이터 출력
    const userRef = ref(db, `users/${uid}`);  // 해당 사용자 데이터에 대한 참조
    const snapshot = await get(userRef);  // 기존 사용자 데이터를 가져옴
    
    // 데이터가 있으면 기존 데이터를 사용하고, 없으면 빈 객체를 생성
    const userData = snapshot.exists() ? snapshot.val() : {};
    
    // 프로필 데이터와 프로필 완료 플래그를 추가하여 업데이트할 데이터 객체 생성
    const updatedData = {
      ...userData,  // 기존 데이터 복사
      profile: profileData,  // 새 프로필 데이터 추가
      profileCompleted: true,  // 프로필 완료 플래그 설정
      updatedAt: new Date().toISOString()  // 업데이트 시간 기록
    };
    
    await set(userRef, updatedData);  // Realtime Database에 업데이트된 데이터 저장
    console.log("Profile data saved successfully");  // 저장 성공 로그 출력
    return true;  // 성공적으로 저장되었으면 true 반환
  } catch (error) {
    console.error("Error saving profile data:", error);  // 에러 발생 시 로그 출력
    return false;  // 에러 발생 시 false 반환
  }
};

// 사용자 설문 데이터를 Realtime Database에 저장하는 함수
export const saveSurveyData = async (uid, surveyData) => {
  try {
    console.log("Saving survey data for:", uid, surveyData);  // 저장할 사용자 ID와 설문 데이터 출력
    const userRef = ref(db, `users/${uid}`);  // 해당 사용자 데이터에 대한 참조
    const snapshot = await get(userRef);  // 기존 사용자 데이터를 가져옴
    
    // 데이터가 있으면 기존 데이터를 사용하고, 없으면 빈 객체를 생성
    const userData = snapshot.exists() ? snapshot.val() : {};
    
    // 설문 데이터와 설문 완료 플래그를 추가하여 업데이트할 데이터 객체 생성
    const updatedData = {
      ...userData,  // 기존 데이터 복사
      survey: surveyData,  // 새 설문 데이터 추가
      surveyCompleted: true,  // 설문 완료 플래그 설정
      updatedAt: new Date().toISOString()  // 업데이트 시간 기록
    };
    
    await set(userRef, updatedData);  // Realtime Database에 업데이트된 데이터 저장
    console.log("Survey data saved successfully");  // 저장 성공 로그 출력
    return true;  // 성공적으로 저장되었으면 true 반환
  } catch (error) {
    console.error("Error saving survey data:", error);  // 에러 발생 시 로그 출력
    return false;  // 에러 발생 시 false 반환
  }
};

// 구글 로그인 함수
export const signInWithGoogle = async () => {
  try {
    // 구글 팝업으로 로그인 시도
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google signin successful:", result.user.uid);  // 로그인 성공 시 사용자 ID 출력
    return result.user;  // 로그인한 사용자 객체 반환
  } catch (error) {
    console.error("Google sign-in error", error);  // 로그인 오류 발생 시 로그 출력
    throw error;  // 오류 발생 시 에러 던짐
  }
};
