import React, {useState, useEffect} from 'react';
import {Modal, Select} from 'antd';

const {Option} = Select;

const EditDeptsModal = ({visible, depts = [], allDepts = [], onCancel, onEdit}) => {
    const [selectedDepts, setSelectedDepts] = useState(depts.map((dept) => dept.name));
    // 当 props 中的 depts 变化时，更新本地状态
    useEffect(() => {
        setSelectedDepts(depts.map((dept) => dept.name));

    }, [depts]);

    const handleSave = () => {
        const selectedDept = allDepts
            .filter((dept) => selectedDepts.includes(dept.name))  // 根据名称筛选
        // .map((role) => role.id);  // 只获取 id
        onEdit(selectedDept);
    };

    return (
        <Modal
            title="编辑用户部门"
            open={visible}
            onCancel={onCancel}
            onOk={handleSave} // 点击确定时保存
        >
            <Select
                mode="multiple"
                style={{width: '100%'}}
                placeholder="请选择部门"
                value={selectedDepts}
                onChange={(newDepts) => setSelectedDepts(newDepts)}  // 更新本地的部门选择
            >
                {allDepts.map((dept) => (
                    <Option key={dept.id} value={dept.name}>
                        {dept.name}
                    </Option>
                ))}
            </Select>
        </Modal>
    );
};

export default EditDeptsModal;
