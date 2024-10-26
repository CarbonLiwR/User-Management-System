import React from 'react';
import {Splitter} from 'antd';


const Personal: React.FC = () => (
  <Splitter style={{ height: "80vh", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
    <Splitter.Panel defaultSize="35%" min="20%" max="50%">
        
    </Splitter.Panel>
    <Splitter.Panel>

    </Splitter.Panel>
  </Splitter>
);

export default Personal;