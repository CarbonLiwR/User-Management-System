import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./index.less";


interface UserInfo {
  username: string;
}

const HomeButtonss: React.FC = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo | null>(null);

  const isLoggedIn = !!currentUserInfo?.username;

  // const getCurrentUserInfo = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/v1/sys/users/me', {
  //       headers: { 'Accept': 'application/json' },
  //     });
  //     setCurrentUserInfo(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch user info:', error);
  //   }
  // };

  // useEffect(() => {
  //   getCurrentUserInfo();
  // }, []);

  return (
    <div className="action-buttons">
      <a href="/login" className="bottom-button" id="loginButton">
        <i className="fas fa-user" style={{ fontSize: '12px', marginRight: '2px' }}></i>
        <span className="button-text">登录/注册</span>
      </a>
      {isLoggedIn && (
        <a href="/dashboard/workplace" className="bottom-button" id="manageGroupButton">
          <span>&#9881;</span>
          <span className="button-text">控制面板</span>
        </a>
      )}
    </div>
  );
};

export default HomeButtonss;
