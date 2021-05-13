import {Tag, Space} from 'antd';
import React from 'react';
// @ts-ignore
import { useModel } from 'umi';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { Fullscreen } from '@alitajs/antd-plus';
import { ExpandOutlined, CompressOutlined } from '@ant-design/icons';


export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [enabled, setEnabled] = React.useState(false);

  const handleClick = () => {
    setEnabled(!enabled);
  };

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue=""
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">000001 华夏成长</a>, value: 'umi ui' },
          {
            label: <a href="https://protable.ant.design/">110011 易方达中小盘</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">000001 平安银行</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      <div>
      <Fullscreen
        enabled={enabled}
        target={document.documentElement}
      >
        {!enabled?<ExpandOutlined onClick={handleClick} />: <CompressOutlined onClick={handleClick}/>}
      </Fullscreen>
    </div>
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </Space>
  );
};

export default GlobalHeaderRight;
