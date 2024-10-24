import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, List, Typography, message } from 'antd';

const { TextArea } = Input;

const WorklogResult: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [logs, setLogs] = useState<{ user_name: string; create_datetime: string; content: string }[]>([]);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      searchWorklogs(q);
    }
  }, [location]);

  const searchWorklogs = async (searchQuery: string) => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/worklogs/search', {
        params: { q: searchQuery },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      message.error('搜索日志时出错，请稍后再试。');
    }
  };

  const formatLogContent = (content: string) => {
    return content
      .replace('解决问题：', '<strong style="color: #2a72d6">解决问题：</strong>')
      .replace('解决方法：', '<strong style="color: #2a72d6"><br>解决方法：</strong>')
      .replace('解决效果：', '<strong style="color: #2a72d6"><br>解决效果：</strong>');
  };

  const sendMessage = async () => {
    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) return;

    setMessages((prev) => [...prev, { sender: 'user', text: trimmedMessage }]);
    setUserMessage('');
    scrollToBottom();

    setLoading(true);
    const loadingMessageIndex = messages.length;
    setMessages((prev) => [...prev, { sender: 'bot', text: '正在思考' }]);
    scrollToBottom();

    try {
      const response = await axios.post('http://localhost:8000/api/v1/worklogs/ask', {
        question: trimmedMessage,
        top_logs: logs,
      });

      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[loadingMessageIndex] = { sender: 'bot', text: response.data.answer || '这是AI的回答。' };
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[loadingMessageIndex] = { sender: 'bot', text: 'AI回答失败，请稍后再试。' };
        return updatedMessages;
      });
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="html">
      <div className="main-container">
        <div className="left-container">
          <h1>搜索 "{query}" 的结果</h1>
          <div id="results-container">
            <List
              bordered
              dataSource={logs}
              renderItem={(log) => (
                <List.Item>
                  <Typography.Text strong>姓名：</Typography.Text> {log.user_name} <br />
                  <Typography.Text strong>撰写时间：</Typography.Text>{' '}
                  {new Date(log.create_datetime).toLocaleString()} <br />
                  <span dangerouslySetInnerHTML={{ __html: formatLogContent(log.content) }} />
                </List.Item>
              )}
            />
            {logs.length === 0 && <p>未找到结果。</p>}
          </div>
        </div>
        <div className="right-container">
          <h1>AI问答</h1>
          <div className="chat-container" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <TextArea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              placeholder="问我任何问题..."
              rows={1}
            />
            <Button onClick={sendMessage} loading={loading}>
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorklogResult;
