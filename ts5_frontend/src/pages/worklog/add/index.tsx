import React, { useEffect, useState } from 'react';
import { Input, Button, Select, Modal, message, Spin, Alert } from 'antd';
import axios from 'axios';
import './add.less';

const { Option } = Select;

const WorklogAdd: React.FC = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [log, setLog] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [checkLoading, setCheckLoading] = useState<boolean>(false);
  const [successVisible, setSuccessVisible] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [refuseVisible, setRefuseVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>('这是标准。');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.get('http://localhost:8000/api/v1/sys/users/me', {
        headers: { Accept: 'application/json' },
      });
      setCurrentUserInfo(response.data);
    };

    const fetchGroups = async () => {
      if (currentUserInfo) {
        const response = await axios.get(`http://localhost:8000/api/v1/sys/depts/${currentUserInfo.id}/all`);
        setGroups(response.data);
        if (response.data.length > 0) {
          setSelectedGroup(response.data[0].id);
        }
      }
    };

    fetchUserInfo().then(fetchGroups);
  }, [currentUserInfo]);

  const handleSubmitLog = async () => {
    if (!log) {
      message.error("请填写工作日志");
      return;
    }

    const logData = `姓名：${currentUserInfo.nickname}\n时间：${currentDate}\n工作日志：${log}`;
    setLoading(true);

    try {
      const response = await axios.put('http://localhost:8000/api/v1/worklogs/submit', {
        text: logData,
        group_uuid: selectedGroup,
        user_uuid: currentUserInfo.uuid,
      });

      setLoading(false);
      if (response.data === 'success') {
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 3000);
      } else {
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      }
    } catch (error) {
      setLoading(false);
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
    }
  };

  const handleCheckLog = async () => {
    setCheckLoading(true);
    const combinedText = `${content}\n\n姓名：${currentUserInfo.nickname}\n时间：${currentDate}\n工作日志：${log}`;
    try {
      const response = await fetch('http://localhost:8000/api/v1/worklogs/check_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: combinedText }),
      });
      const result = await response.json();
      setCheckLoading(false);
      setModalContent(result.checkedText || '');
      setModalVisible(true);
    } catch (error) {
      setCheckLoading(false);
      message.error('检查日志时发生错误');
    }
  };

  const handleConfirmation = () => {
    setConfirmationVisible(false);
    // 继续提交
  };

  const handleRefuse = () => {
    setRefuseVisible(false);
    // 继续修改
  };

  return (
    <div className="container">
      {successVisible && <Alert message="日志已提交并处理成功" type="success" />}
      {errorVisible && <Alert message="提交日志时发生错误，请稍后重试。" type="error" />}

      {loading && <Spin tip="Loading..." />}

      <div className="toolbar">
        <label>姓名：</label>
        <Input value={currentUserInfo?.nickname} readOnly style={{ width: 130 }} />

        <label>时间：</label>
        <Input value={currentDate} readOnly style={{ width: 130 }} />

        <label>选择组:</label>
        <Select value={selectedGroup} onChange={setSelectedGroup} style={{ width: 100, marginLeft: 5 }}>
          {groups.map(group => (
            <Option key={group.id} value={group.id}>{group.name}</Option>
          ))}
        </Select>
      </div>

      <label>工作日志：</label>
      <Input.TextArea
        value={log}
        onChange={(e) => setLog(e.target.value)}
        placeholder="请输入工作日志内容..."
      />

      <div className="button">
        <Button onClick={handleSubmitLog} loading={loading}>提交</Button>
        <Button onClick={handleCheckLog} loading={checkLoading}>检查</Button>
        <Button onClick={() => setLog('')}>清除</Button>
        <Button onClick={() => setModalVisible(true)}>查看标准</Button>
        <Button onClick={() => setRefuseVisible(true)}>修改标准</Button>
      </div>

      <Modal visible={modalVisible} title="检查结果" onCancel={() => setModalVisible(false)}>
        <p>{modalContent}</p>
      </Modal>

      <Modal visible={confirmationVisible} title="确认" onCancel={() => setConfirmationVisible(false)}>
        <p>尚有需要添加的内容，是否继续提交？</p>
        <Button onClick={handleConfirmation}>确定</Button>
        <Button onClick={() => setConfirmationVisible(false)}>取消</Button>
      </Modal>

      <Modal visible={refuseVisible} title="拒绝" onCancel={handleRefuse}>
        <p>您的工作日志未达到80%符合指数，请继续修改</p>
        <Button onClick={handleRefuse}>继续修改</Button>
      </Modal>
    </div>
  );
};

export default WorklogAdd;
