import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import styles from './theme.module.css'; // 导入 CSS 模块


const Theme: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate(); // 使用 react-router-dom 的 useNavigate 进行页面跳转

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认表单提交行为
    try {
        navigate(`/worklog/result?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
        console.error('搜索失败:', error);
        alert('搜索失败，请稍后再试。');
    }
};


  return (
    <div className={styles.searchContainer}>
      <mainword>技术寻人</mainword>
      <form id="searchForm" onSubmit={handleSearch}>
        <input
          type="text"
          name="q"
          placeholder="搜索日志..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 使用 onChange 处理输入
          className={styles.inputText} // 使用 CSS 模块类名
        />
        <input
          type="submit"
          id="searchButton"
          value="搜索"
          style={{ fontSize: '14.1px' }}
          className={styles.searchButton} // 使用 CSS 模块类名
        />
      </form>
    </div>
  );
};

export default Theme;
