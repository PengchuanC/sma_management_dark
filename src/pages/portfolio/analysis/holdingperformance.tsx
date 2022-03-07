// eslint-disable-next-line max-classes-per-file
import React from 'react';
import { AnalysisTabContext } from "@/utils/localstorage";
import {Table, Row, Col, Radio, Button} from "antd";
import http from '@/utils/http';
import * as numeral from "numeral";
import styles from './analysis.less';
import moment from "moment";
import {formatPercent} from "@/utils/util";


const options = [
  { label: '一级分类', value: '1' },
  { label: '二级分类', value: '2' },
  { label: '主动投资', value: '3' },
  { label: '仓位占比', value: '4' },
];

class Performance extends React.Component<any, any> {
  static contextType = AnalysisTabContext

  state = {
    portCode: this.props.portCode,
    data: [],
    date: this.context.date,
    type: '1'
  }

  fetchData = (type: string = this.state.type)=>{
    http.get('/analysis/holding/', {
      params: {portCode: this.state.portCode, date: this.context.date.format("YYYY-MM-DD"), type}
    }).then(r=>{
      this.setState({data: r.data, date: this.context.date})
    })
  }

  onSelect = (e: any)=>{
    const type = e.target.value
    this.fetchData(type)
    this.setState({type})
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate() {
    if (this.state.date.format('yyyyMMDD') !== this.context.date.format('yyyyMMDD')) {
      this.fetchData()
    }
  }

  render() {
    const columns: any[] = [
      {
        title: '类型',
        dataIndex: 'category',
        key: 'category',
        align: 'center',
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '证券名称',
        dataIndex: 'secuname',
        key: 'secuname',
        align: 'left',
      },
      {
        title: '证券分类',
        dataIndex: 'second',
        key: 'second',
        align: 'left',
      },
      {
        title: '持仓占比',
        dataIndex: 'holding_ratio',
        key: 'holding_ratio',
        align: 'right',
        render: (text: number)=> numeral(text).format('0.00%')
      },
      {
        title: '累计收益',
        dataIndex: 'profit',
        key: 'profit',
        align: 'right',
        render: (text: number)=> numeral(text).format( '0,000.0')
      },
      {
        title: '加权平均收益率',
        dataIndex: 'ret_yield',
        key: 'ret_yield',
        align: 'right',
        render: (text: number)=> numeral(text).format('0.00%')
      },
    ]
    return (
      <>
        <div className={styles.performance}>
          <Button>基金类型</Button>
          <Radio.Group options={options} onChange={this.onSelect} value={this.state.type} />
        </div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          size={'small'}
          pagination={false}
          bordered
          className={styles.table}
        >
        </Table>
      </>
    );
  }
}

class Profit extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state = {
    tableData: [],
    portCode: this.props.portCode,
    date: this.context.date,
  }

  fetchData = ()=>{
    http.get(
      '/analysis/profit/',
      {
        params: {
          portCode: this.state.portCode,
          date: moment(this.context.date).format('YYYY-MM-DD')
        }
      }).then(r => {
      this.setState({tableData: r, date: this.context.date})
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate() {
    if (this.state.date.format('yyyyMMDD') !== this.context.date.format('yyyyMMDD')) {
      this.fetchData()
    }
  }

  render() {
    const columns: any = [
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
        width: 120
      },
      {
        title: '基金名称',
        dataIndex: 'secuabbr',
        key: 'secuabbr',
        align: 'left',
        width: 200
      },
      {
        title: '近1周',
        dataIndex: 'week',
        key: 'week',
        align: 'right',
        render: (text: number) => formatPercent(text)
      },
      {
        title: '近1月',
        dataIndex: 'month',
        key: 'month',
        align: 'right',
        render: (text: number) => formatPercent(text)
      },
      {
        title: '近1季',
        dataIndex: 'quarter',
        key: 'quarter',
        align: 'right',
        render: (text: number) => formatPercent(text)
      },
      {
        title: '成立以来',
        dataIndex: 'setup',
        key: 'setup',
        align: 'right',
        render: (text: number) => formatPercent(text)
      },
    ]
    return (
      <>
        <Button>区间贡献</Button>
        <Table
          columns={columns}
          dataSource={this.state.tableData}
          size={'small'}
          bordered
          pagination={false}
          className={styles.table}
        />
      </>
    );
  }
}



export default class HoldingPerformance extends React.Component<any, any> {

  state = {
    portCode: this.props.portCode,
  }

  render() {
    return (
      <>
        <Row className={styles.holdingPerformance}>
          <Col span={12}>
            <Performance portCode={this.state.portCode} />
          </Col>
          <Col span={12}>
            <Profit portCode={this.state.portCode} />
          </Col>
        </Row>
      </>
    );
  }
}
