import { useEffect, useState } from "react";
import { Modal,  Select, message, FormInstance } from "antd";
import MyForm, { FormItemData } from "@/components/form";
import { getPower, addUser, getUser, editUser } from "@/api";

export type UserID = null | number
interface UserProps {
  user_id: UserID
  isShow: boolean
  onCancel: (id: UserID, s: boolean) => void
  onOk: () => void
}
const { Option } = Select;

const paswdRule = [{ required: true, message: "请填写登录密码" }];
const initFormItems: FormItemData[] = [
  {
    itemRole: "input",
    itemProps: {
      name: "nickname",
      rules: [{ required: true, message: "请填写用户名" }],
      label: "用户名",
    },
    childProps: {
      placeholder: "用户名",
    },
  },
  {
    itemRole: "input",
    itemProps: {
      name: "account",
      rules: [{ required: true, message: "请填写登录账号" }],
      label: "登录账号",
    },
    childProps: {
      placeholder: "登录账号",
    },
  },
  {
    itemRole: "input",
    itemProps: {
      name: "pswd",
      label: "登录密码",
    },
    childProps: {
      placeholder: "登录密码,若填写则表示修改",
      type: "password",
    },
  },
  {
    itemRole: "select",
    itemProps: {
      rules: [{ required: true, message: "请选择菜单权限" }],
      name: "type_id",
      label: "菜单权限",
    },
    childProps: {
      placeholder: "菜单权限",
    },
  },
];

export default function UserModal({ user_id, isShow, onCancel, onOk }: UserProps) {
  const [form, setForm] = useState<FormInstance | null>(null);
  const [formItems, setItems] = useState<FormItemData[]>([]);
  useEffect(() => {
    if (isShow) {
      getPower().then((res) => {
        const { data, status } = res;
        if (status === 0) {
          let items = initFormItems.map((i) => ({ ...i }));
          items.forEach((i) => {
            if (i.itemProps.name === "type_id") {
              i.childProps = { ...i.childProps }
              i.childProps.children = data.map((power) => (
                <Option value={power.role_id} key={power.role_id}>
                  {power.name}
                </Option>
              ));
            }
          });
          setItems(items);
        }
      });
    }
  }, [isShow]);


  useEffect(() => {
    if (user_id && form) {
      getUser({ user_id }).then((res) => {
        if (res.data) {
          form.setFieldsValue(res.data);
        }
      });
      let items = initFormItems.map((i) => ({ ...i }));
      items.forEach((i) => {
        if (i.itemProps.name === "pswd") {
          i.itemProps.rules = undefined;
        }
      });
      setItems(items);
    } else if (!user_id) {
      // set formItem
      let items = initFormItems.map((i) => ({ ...i }));
      items.forEach((i) => {
        if (i.itemProps.name === "pswd") {
          i.itemProps.rules = paswdRule;
        }
      });
      setItems(items);
    }
  }, [user_id, form]);

  const submit = () => {
    form && form.validateFields().then((values) => {
      let modify = Boolean(user_id);
      let fn = modify ? editUser : addUser;
      if (modify) {
        values.user_id = user_id;
      }
      fn(values).then((res) => {
        if (res.status === 0) {
          message.success(res.msg);
          close();
          onOk();
        }
      });
    });
  };
  const close = () => {
    form && form.resetFields();
    onCancel(null, false);
  };
  return (
    <Modal
      maskClosable={false}
      title={user_id ? "修改信息" : "添加账户"}
      open={isShow}
      okText="确认"
      cancelText="取消"
      onCancel={close}
      onOk={submit}
    >
      <MyForm handleInstance={setForm} items={formItems} />
    </Modal>
  );
}
