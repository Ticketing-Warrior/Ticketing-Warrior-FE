import React, { useState, useEffect } from 'react';
import './NicknameDisplay.css'; 

const NicknameDisplay = () => {
  // 초기 상태 설정: localStorage에서 닉네임을 읽어옴
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('nickname') || '';
  });

  useEffect(() => {
    // 닉네임 변경을 감지하고 상태를 업데이트하는 함수
    const updateNickname = () => {
      const storedNickname = localStorage.getItem('nickname');
      if (storedNickname) {
        setNickname(storedNickname);
      } else {
        setNickname(''); // 닉네임이 삭제된 경우 초기화
      }
    };

    // 'storage' 이벤트를 리스너에 추가
    // StartPage에서 window.dispatchEvent(new Event('storage'))를 호출하면 이 리스너가 작동합니다.
    window.addEventListener('storage', updateNickname);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거하여 메모리 누수를 방지합니다.
    return () => {
      window.removeEventListener('storage', updateNickname);
    };
  }, []); // 빈 배열: 마운트/언마운트 시에만 실행

  if (!nickname) {
    return null; 
  }

  return (
    <div className="nickname-display">
      {nickname}님
    </div>
  );
};

export default NicknameDisplay;