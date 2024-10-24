import React, {useEffect, useState} from 'react';
import {Input, Button, Select, Modal, message, Spin, Alert, Flex} from 'antd';
import axios from 'axios';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {getToken} from '../../../utils/auth';
import Draggable from 'react-draggable';

const {Option} = Select;

const WorklogAdd: React.FC = () => {
    const currentuser = useSelector((state: RootState) => state.user);
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const getChinaDate = (): string => {
        const date = new Date();
        const chinaTimezoneOffset = 8 * 60; // 中国时间偏移量 (分钟)
        const localTimezoneOffset = date.getTimezoneOffset(); // 本地时区偏移量 (分钟)
        const chinaTime = new Date(date.getTime() + (chinaTimezoneOffset + localTimezoneOffset) * 60 * 1000);
        return chinaTime.toISOString().split('T')[0];
    };
    const [currentDate, setCurrentDate] = useState<string>(getChinaDate());
    const [log, setLog] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [checkLoading, setCheckLoading] = useState<boolean>(false);
    const [successVisible, setSuccessVisible] = useState<boolean>(false);
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [standardVisible, setStandardVisible] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const [refuseVisible, setRefuseVisible] = useState<boolean>(false);
    const [standardContent, setStandardContent] = useState<string>('这是标准。');
    const token = getToken();

    useEffect(() => {
    console.log('666'+groups); // 这里会在 groups 更新后执行
}, [groups]);


    useEffect(() => {
    const fetchGroups = async () => {
        if (currentuser) {
            console.log(currentuser);
            const response = await axios.get(`http://localhost:8000/api/v1/sys/depts/${currentuser.id}/all`);
            setGroups(response.data); // 确保使用 response.data
            console.log(response.data); // 在这里输出响应数据

            if (response.data.length > 0) {
                setSelectedGroup(response.data[0].id);
                console.log(response.data[0].id);
            }
        }
    };
    fetchGroups();
}, [currentuser]);

    const handleSubmitLog = async () => {
        if (!log) {
            message.error("请填写工作日志");
            return;
        }
        // handleCheckLog();

        const logData = `姓名：${currentuser.nickname}\n时间：${currentDate}\n工作日志：${log}`;
        setLoading(true);


        console.log('提交' + logData);
        // 提交日志
        try {
            const response = await axios.put('http://localhost:8000/api/v1/worklogs/submit', {
                text: logData,
                group_uuid: selectedGroup,
                user_uuid: currentuser.uuid,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // 添加请求头
                },
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
        const combinedText = `${standardContent}\n\n姓名：${currentuser.nickname}\n时间：${currentDate}\n工作日志：${log}`;
        console.log('检查' + combinedText);
        try {
            const response = await fetch('http://localhost:8000/api/v1/worklogs/check_text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // 添加请求头
                },
                body: JSON.stringify({text: combinedText}),
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
        <Flex gap="small" vertical>
            {successVisible && <Alert message="日志已提交并处理成功" type="success"/>}
            {errorVisible && <Alert message="提交日志时发生错误，请稍后重试。" type="error"/>}

            {loading && <Spin tip="Loading..."/>}
            <Flex gap="small" wrap>
                <label>姓名：</label>
                <Input value={currentuser?.nickname} readOnly style={{width: 130}}/>

                <label>时间：</label>
                <Input value={currentDate} readOnly style={{width: 130}}/>

                <label>选择组:</label>
                <Select value={selectedGroup} onChange={setSelectedGroup} style={{width: 100, marginLeft: 5}}>
                    {groups.map(group => (
                        <Option key={group.id} value={group.id}>{group.name}</Option>
                    ))}
                </Select>
            </Flex>

            <label>工作日志：</label>
            <Flex gap="small" vertical>
                <Input.TextArea
                    value={log}
                    onChange={(e) => setLog(e.target.value)}
                    placeholder="请输入工作日志内容..."
                    style={{width: '100%', height: '70vh'}}
                />

                <Flex gap="small" wrap>
                    <Button onClick={handleSubmitLog} loading={loading}>提交</Button>
                    <Button onClick={handleCheckLog} loading={checkLoading}>检查</Button>
                    <Button onClick={() => setLog('')}>清除</Button>
                    <Button onClick={() => setStandardVisible(true)}>查看标准</Button>
                </Flex>
            </Flex>

            <Modal
                visible={standardVisible}
                title="工作日志标准"
                onCancel={() => setStandardVisible(false)}
                footer={null}
                mask={false}
                maskClosable={false}
            >
                <p>{standardContent}</p>
            </Modal>

            <Modal
                visible={modalVisible}
                title="检查结果"
                onCancel={() => setModalVisible(false)}
                footer={null}
                mask={false}
                maskClosable={false}
            >
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
        </Flex>
    );
};

export default WorklogAdd;
