import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TabBar, TabBarItem } from "tdesign-mobile-react";

interface BottomBarProps {
  defaultSelected?: string;
  itemList: { value: string; label: string }[];
}

const BottomBar = ({ defaultSelected = 'shelf', itemList }: BottomBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentBar, setCurrentBar] = useState(defaultSelected);
  const change = (changeValue: string | number) => {
    const value = String(changeValue);
    setCurrentBar(value);
    navigate(`/${value}`);
  };

  useEffect(() => {
    const pathname = location.pathname;
    const value = pathname.split('/')[1];
    if (value && itemList.some(item => item.value === value)) {
      setCurrentBar(value);
    }
  }, [location, itemList]);

  return (
    <div className="demo-tab-bar">
      <TabBar value={currentBar} onChange={change} theme="tag" split={false}>
        {itemList.map((item, i) => (
          <TabBarItem key={item.value || i} value={item.value}>
            {item.label}
          </TabBarItem>
        ))}
      </TabBar>
    </div>
  );
}

export { BottomBar}