import React from 'react';
import moment from 'moment';
import {numeralNum} from "@/utils/util";
import { Row, Col, Statistic, Card, DatePicker, Table } from 'antd';
import styles from '@/pages/portfolio/glance/list.less';
import http from '@/utils/http';

export default class CapitalAnalyze extends React.Component<any, any> {
  state: {
    total: { p_total?: number; r_total?: number };
    date: moment.Moment;
    detail: any;
  } = {
    total: {},
    date: moment(new Date()),
    detail: [],
  };

  fetchData = (date: moment.Moment | null) => {
    http
      .get('/basic/capital/', {
        params: { date: date?.format('YYYY-MM-DD') },
      })
      .then(r => {
        this.setState({
          total: {p_total: r.p_total, r_total: r.r_total},
          date: moment(r.date),
          detail: r.data,
        });
      });
  };

  onChange = (date: moment.Moment | null) => {
    this.fetchData(date);
  };

  componentDidMount() {
    this.fetchData(this.state.date);
  }

  render() {
    const columns: any = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '确认日期',
        dataIndex: 'confirm',
        key: 'confirm',
        align: 'center',
      },
      {
        title: '当日入金(元)',
        dataIndex: 'pr_amount',
        key: 'pr_amount',
        align: 'right',
        render: (text: any, record: any) => numeralNum(record.pr_amount),
      },
      {
        title: '当日出金(元)',
        dataIndex: 'rs_amount',
        key: 'rs_amount',
        align: 'right',
        render: (text: any, record: any) => numeralNum(record.rs_amount),
      },
      {
        title: '当日净入金(元)',
        dataIndex: 'net',
        key: 'net',
        align: 'right',
        render: (text: any, record: any) => numeralNum(record.net),
      },
    ];
    return (
      <>
        <DatePicker
          placeholder="修改日期"
          value={this.state.date}
          onChange={this.onChange}
        />
        <Row>
          <Col offset={1} span={4}>
            <Card className={styles.statisticCard}>
              <Statistic
                title="累计入金"
                value={this.state.total?.p_total || 0}
                precision={2}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card className={styles.statisticCard}>
              <Statistic
                title="累计出金"
                value={this.state.total?.r_total || 0}
                precision={2}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={22} offset={1}>
            <Table
              className={styles.capitalTable}
              size="small"
              bordered
              columns={columns}
              dataSource={this.state.detail}
              pagination={{pageSize: 20}}
            />
          </Col>
        </Row>
      </>
    );
  }
}
