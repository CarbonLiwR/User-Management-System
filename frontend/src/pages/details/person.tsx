import { ReactNode, useState } from "react";
import { Card, Tag, Input, Tabs, Row, Col, List, Space, Avatar } from "antd";
import MyIcon from "@/components/icon";
import "./index.less";
import { useStyle } from "./style";

const { Meta } = Card;

const tagInitVal = [
  { value: "足球", color: "magenta" },
  { value: "跑步", color: "volcano" },
  { value: "Web前端", color: "orange" },
];

function getRandomColor() {
  return "#" + Math.random().toString(16).slice(2, 8);
}

const listData = Array.from({ length: 10 }, (v, k) => ({
  title: `Item ${k + 1}`,
  avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  description: "描述信息。",
}));

const IconText = ({ icon, text }: { icon: ReactNode, text: string }) => (
  <Space>
    {icon}
    {text}
  </Space>
);

const tabpanes = Array.from({ length: 3 }, (v, k) => ({
  key: k + '',
  label: `Tab ${k + 1}`,
  children: (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={listData}
      renderItem={(item) => (
        <List.Item
          key={item.title}
          actions={[
            <IconText icon={<MyIcon type="icon_collection" />} text="156" />,
            <IconText icon={<MyIcon type="icon_zan" />} text="156" />,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  )
}));

export default function Person() {
  const [tags, setTag] = useState(tagInitVal);
  const [isInput, setInput] = useState(false);
  const [value, setVal] = useState("");
  const { styles } = useStyle();

  const addTags = () => {
    if (!value) {
      return setInput(false);
    }
    const tempTag = { value: value, color: getRandomColor() };
    setVal("");
    setTag([...tags, tempTag]);
    setInput(false);
  };

  return (
    <div className="person-container">
      <Row>
        {/*用户*/}
        <Col span={6}>
          <Card
            cover={
              <img
                alt="example"
                src="https://avatars.githubusercontent.com/u/56569970?v=4"
              />
            }
          >
            <Meta title="用户名" description="个人描述" />
            <div className={styles.info}>
              <p>
                <MyIcon type="icon_infopersonal" className="icon" />
                职业
                <span className={styles.font}>123</span>
              </p>
              <p>
                <MyIcon type="icon_address1" className="icon" />
                地点
              </p>
            </div>
            <div className="tags">
              <div className="title">标签</div>
              <div className="wrapper">
                {tags.map((item) => (
                  <Tag color={item.color} key={item.color}>
                    {item.value}
                  </Tag>
                ))}
                {isInput ? (
                  <Input
                    placeholder="请输入"
                    className="ipt"
                    onBlur={addTags}
                    value={value}
                    onChange={(e) => setVal(e.target.value)}
                  />
                ) : (
                  <MyIcon type="icon_increase" onClick={() => setInput(true)} />
                )}
              </div>
            </div>
          </Card>
        </Col>
        {/*展板*/}
        <Col span={17} offset={1} className={styles.tabs}>
          <Tabs defaultActiveKey="1" items={tabpanes} />
        </Col>
      </Row>
    </div>
  );
}
Person.route = { [MENU_PATH]: "/details/person" };
