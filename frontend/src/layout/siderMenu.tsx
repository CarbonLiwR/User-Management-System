import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Affix, Col } from "antd";
import MyIcon from "@/components/icon";
import { MenuItem } from "@/types";
import * as layoutTypes from "@/store/layout/actionTypes";
import { useDispatchMenu, useStateLayout, useStateMenuList, useStateOpenMenuKey } from "@/store/hooks";
import { useStyle } from "./style";

const { Sider } = Layout;

const renderMenu = (item: MenuItem, path: string) => {
  // 这里的逻辑与之前相同
};

const SiderMenu = () => {
  const location = useLocation(); // 获取当前路径
  const [collapsed, setCollapsed] = useState(false);
  const openKeys = useStateOpenMenuKey();
  const layout = useStateLayout();
  const menuList = useStateMenuList();
  const { styles } = useStyle();

  const selectedKeys = useMemo(() => {
    const keys: string[] = [];
    menuList.forEach(menu => {
      const findKeys = (item: MenuItem) => {
        if (item[MENU_PATH] && location.pathname.includes(item[MENU_PATH])) {
          keys.push(item[MENU_KEY]);
        }
        if (item.children) {
          item.children.forEach(findKeys);
        }
      };
      findKeys(menu);
    });
    return keys;
  }, [menuList, location.pathname]);

  const menuComponent = useMemo(() => menuList.map(m => renderMenu(m, '')), [menuList]);

  return (
    <Affix>
      <Sider width={200} collapsed={collapsed}>
        <Menu
          mode="inline"
          className={styles.layoutSilderMenu}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          items={menuComponent}
        />
        <Button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "展开" : "收起"}
        </Button>
      </Sider>
    </Affix>
  );
};

export default SiderMenu;
