import React, { useState } from 'react';
import "./index.less";

const Theme: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  // const navigate = useNavigate(); // 使用 react-router-dom 的 useNavigate 进行页面跳转

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault(); // 阻止默认表单提交行为
    // try {
    //   navigate(`/result?q=${encodeURIComponent(searchQuery)}`);
    // } catch (error) {
    //   console.error('搜索失败:', error);
    //   alert('搜索失败，请稍后再试。');
    // }
  };

  return (
    <div className="search-container">
      <h1>技术寻人</h1>
      <form id="searchForm" onSubmit={handleSearch}>
        <input
          type="text"
          name="q"
          placeholder="搜索日志..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 使用 onChange 处理输入
          style={{ marginBottom: 0 }}
        />
        <input
          type="submit"
          id="searchButton"
          value="搜索"
          style={{ fontSize: '14.1px' }}
        />
      </form>
      {/*<div className="examples">*/}
      {/*  <div className="bottom-button">*/}
      {/*    好的*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default Theme;
