import React from 'react';
import { Table } from 'antd';
import './list.less';
// @ts-ignore
import { history } from 'umi';
import { PortfolioContext } from '@/utils/localstorage';
import api from '@/utils/http';
import { numeralNum } from '@/utils/util';
import Cache from "@/utils/localstorage";

interface record {
  key: string;
  port_name: string;
  port_code: string;
  port_type: string;
  launch_date: string;
  last: string;
  net_asset: number;
  init_money: number;
  add: number;
  profit: number;
  nav: number;
  nav_acc: number;
  cash: number;
  value: number;
  fa: string;
}

export default class PortfolioTable extends React.Component {
  state = {
    filteredInfo: {},
    sortedInfo: {
      columnKey: undefined,
      order: false,
    },
    data: []
  };

  fetchData() {
    api.get('/basic/all/').then(r => {
      const { sma } = r
      this.setState({ data: sma });
    });
  }

  static contextType = PortfolioContext;

  // 按类型筛选
  filterType = (value: string, record: record) => {
    return record.port_type === value;
  };

  handleClick = (portcode: string, portName: string) => {
    this.context.setPortCode(portcode);
    Cache.dumpPortfolio(portcode);
    localStorage.setItem('portName', portName);
    history.push('/portfolio/overview');
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const columns: any = [
      {
        title: '#',
        render: (text: any, record: any, index: any) => `${index+1}`,
        align: 'center',
        width: 60
      },
      {
        title: '产品代码',
        dataIndex: 'port_code',
        key: 'port_code',
        align: 'center',
      },
      {
        title: '产品名称',
        dataIndex: 'port_name',
        key: 'port_name',
        align: 'left',
      },
      {
        title: '产品类型',
        dataIndex: 'port_type',
        key: 'port_type',
        align: 'center',
        filters: [
          { text: '现金型', value: '现金型' },
          { text: '固收型', value: '固收型' },
          { text: '平衡型', value: '平衡型' },
          { text: '成长型', value: '成长型' },
          { text: '权益型', value: '权益型' },
          // { text: 'CTA', value: 'CTA' },
        ],
        onFilter: this.filterType,
      },
      {
        title: '成立日期',
        dataIndex: 'launch_date',
        key: 'launch_date',
        align: 'center',
        sorter: (a: record, b: record) => {
          if (a.launch_date > b.launch_date) return 1;
          return -1;
        },
      },
      {
        title: '净值日期',
        dataIndex: 'last',
        key: 'last',
        align: 'center',
      },
      {
        title: '资产净值',
        dataIndex: 'net_asset',
        key: 'net_asset',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.net_asset),
      },
      {
        title: '初始资产',
        dataIndex: 'init_money',
        key: 'init_money',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.init_money),
      },
      {
        title: '期间追加',
        dataIndex: 'add',
        key: 'add',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.add),
      },
      {
        title: '累计收益',
        dataIndex: 'profit',
        key: 'profit',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.profit),
      },
      {
        title: '单位净值',
        dataIndex: 'nav',
        key: 'nav',
        align: 'center',
        render: (text: string, record: record) => numeralNum(record.nav),
      },
      {
        title: '累计净值',
        dataIndex: 'nav_acc',
        key: 'nav_acc',
        align: 'center',
        render: (text: string, record: record) => numeralNum(record.nav_acc),
      },
      {
        title: '可用现金',
        dataIndex: 'cash',
        key: 'cash',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.cash),
      },
      {
        title: 'FA',
        dataIndex: 'fa',
        key: 'fa',
        align: 'right',
        render: (text: any, record: record) => record.fa,
      },
    ];
    return (
      <>
        <Table
          key="sma_table"
          dataSource={this.state.data}
          columns={columns}
          bordered
          pagination={false}
          size="small"
          className="table"
          onRow={(record: record) => {
            return {
              onClick: () => {
                this.handleClick(record.port_code, record.port_name)
              },
            };
          }}
        />
      </>
    );
  }
}
