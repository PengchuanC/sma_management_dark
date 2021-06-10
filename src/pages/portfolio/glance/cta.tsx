// eslint-disable-next-line max-classes-per-file
import React from "react";
import api from '@/utils/http';
import { Button, Card, Col, Row, Statistic, Table } from "antd";
import styles from './list.less';
import { PortfolioContext } from "@/utils/localstorage";
import { numeralNum } from "@/utils/util";
import { history } from "umi";


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


class CtaTable extends React.Component<any, any> {

  state = {
    filteredInfo: {},
    sortedInfo: {
      columnKey: undefined,
      order: false,
    },
    data: []
  };


  static contextType = PortfolioContext;

  // 按类型筛选
  filterType = (value: string, record: record) => {
    return record.port_type === value;
  };

  handleClick = (record: record)=>{
    const { port_code, port_name } = record
    sessionStorage.setItem('cta_name', port_name)
    sessionStorage.setItem('cta_code', port_code)
    history.push('/portfolio/cta')
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
          { text: 'CTA', value: 'CTA' },
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
    ];
    return (
      <>
        <Table
          key="cta_table"
          dataSource={this.props.data}
          columns={columns}
          bordered
          pagination={false}
          size="small"
          className="table"
          onRow={(record: record) => {
            return {
              onClick: () => {
                this.handleClick(record)
              },
            };
          }}
        />
      </>
    );
  }
}




export default class CtaHomePage extends React.Component<any, any> {

  state = {
    data: [],
    num: 0,
    total: 0,
    avg: 0
  }

  fetchData() {
    api.get('/cta/').then(r => {
      const { data, num, total, avg } = r
      this.setState({ data, num, total, avg });
    });
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <div className={styles.cta}>
        <Button className={styles.button}>CTA产品</Button>
        <div className={styles.contentArea}>
          <Row>
            <Col offset={1} span={5}>
              <Card className={styles.statisticCard}>
                <Statistic title="账户总数" value={this.state?.num} />
              </Card>
            </Col>
            <Col span={5}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="管理资产"
                  value={this.state?.total}
                  precision={2}
                />
              </Card>
            </Col>
            <Col span={5}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="户均资产"
                  value={this.state?.avg}
                  precision={2}
                />
              </Card>
            </Col>
          </Row>
          <br/>
        </div>
        <CtaTable data={this.state.data} />
      </div>
    );
  }
}
