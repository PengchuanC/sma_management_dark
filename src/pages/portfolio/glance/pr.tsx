/*
 * title: 客户申赎记录
 * */

import React from 'react';
import { Button, Table } from 'antd';
import styles from './list.less';
import http from '@/utils/http';
import {numeralNum} from "@/utils/util";

// 基金申赎数据类型
interface PRType {
  id?: number;
  port_code_id: string;
  date: string;
  confirm: string;
  pr_amount: number;
  rs_amount: number;
  rs_fee: number;
  ogr_name: string;
}

// Table column
const columns: any = [
  {
    title: '序号',
    align: 'center',
    render: (text: string, record: PRType, index: number) => `${index + 1}`,
  },
  {
    title: '组合代码',
    key: 'port_code_id',
    dataIndex: 'port_code_id',
    align: 'left',
  },
  {
    title: '申请日期',
    key: 'date',
    dataIndex: 'date',
    align: 'center',
    sorter: (row1: any, row2: any) => row1.date >= row2.date
  },
  {
    title: '确认日期',
    key: 'confirm',
    dataIndex: 'confirm',
    align: 'center',
    sorter: (row1: any, row2: any) => row1.confirm >= row2.confirm
  },
  {
    title: '申购金额',
    key: 'pr_amount',
    dataIndex: 'pr_amount',
    align: 'right',
    render: (text: any, row: PRType) => numeralNum(row.pr_amount)
  },
  {
    title: '赎回金额',
    key: 'rs_amount',
    dataIndex: 'rs_amount',
    align: 'right',
    render: (text: any, row: PRType) => numeralNum(row.rs_amount)
  },
  {
    title: '赎回费用',
    key: 'rs_fee',
    dataIndex: 'rs_fee',
    align: 'right',
    render: (text: any, row: PRType) => numeralNum(row.rs_fee)
  },
  {
    title: '机构名称',
    key: 'org_name',
    dataIndex: 'org_name',
    align: 'right',
  },
];

export default class PurchaseAndRansom extends React.Component<any, any> {
  state = {
    completed: [],
  };

  fetchCompleted = () => {
    http.get('/basic/pr/').then(r => {
      this.setState({ completed: r.completed });
    });
  };



  componentDidMount() {
    this.fetchCompleted();
  }

  render() {
    return (
      <div className={styles.pr}>
        <Button className={styles.button}>已完成</Button>
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={this.state.completed}
          pagination={{pageSize: 15}}
        />
      </div>
    );
  }
}
