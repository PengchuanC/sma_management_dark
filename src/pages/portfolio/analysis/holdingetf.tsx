import React from 'react';
import {Table, Col, Row, Statistic} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnalysisTabContext } from '@/utils/localstorage';
import http from '@/utils/http';
import {formatPercent, numeralNum} from '@/utils/util';
import style from './analysis.less'
import moment from "moment";


export default class HoldingETF extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state: {data: holdingETF[], portCode: string, date: moment.Moment, trans: transETF[], win: number, total: number, selected: any} = {
    portCode: this.props.portCode,
    date: this.context.date,
    data: [],
    trans: [],
    win: 0,
    total: 0,
    selected: {
      data: [],
      total: 0,
      win: 0
    }
  }

  fetchData = ()=>{
    http.get('/analysis/fundholding/etf/', {
      params: {portCode: this.state.portCode, date: this.state.date.format('YYYY-MM-DD')}
    }).then((r)=>{
      this.setState({date: this.context.date, data: r})
    })
  }

  fetchTrans = () => {
    http.get('/analysis/fundholding/etf_analysis/', {
      params: {port_code: this.state.portCode}
    }).then((r: any)=>{
      const {win, total, data} = r
      this.setState({win, total, trans: data})
    })
  }

  onClick = (secucode: string) => {
    const data: any[] = []
    let total = 0
    let win_count = 0
    this.state.trans.forEach((x: any) => {
      if (x.secucode === secucode){
        data.push(x)
        total += Number(x.profit)
        if (x.r >=0) {
          win_count += 1
        }
      }
    })
    const win = win_count / data.length
    this.setState({selected: {data, total, win}})
  }

  componentDidUpdate() {
    if (this.state.date.date() !== this.context.date.date()) {
      this.fetchData()
    }
  }

  componentDidMount() {
    this.fetchData()
    this.fetchTrans()
  }

  render() {
    const columns: ColumnsType<holdingETF> = [
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '基金名称',
        dataIndex: 'secuabbr',
        key: 'secuabbr',
        align: 'left',
        width: 160
      },
      {
        title: '估值日期',
        key: 'date',
        dataIndex: 'date',
        align: 'center',
        render:(text: any, record)=>moment(record.date).format('YYYY-MM-DD')
      },
      {
        title: '持仓收益',
        dataIndex: 'total_profit',
        key: 'total_profit',
        align: 'right',
        render: (text: any, record) => numeralNum(record.total_profit)
      },
      {
        title: '交易佣金',
        dataIndex: 'fee',
        key: 'fee',
        align: 'right',
        render: (text: any, record) => numeralNum(record.fee)
      },
      {
        title: '持仓市值(元)',
        dataIndex: 'mkt_cap',
        key: 'mkt_cap',
        align: 'right',
        render: (text: any, record: holdingETF) => numeralNum(record.mkt_cap),
      },
      {
        title: '持仓份额',
        dataIndex: 'holding_value',
        key: 'holding_value',
        align: 'right',
        render: (text: any, record: holdingETF) => numeralNum(record.holding_value),
      }
    ]

    const columns2: ColumnsType<transETF> = [
      {
        title: '买入日期',
        key: 'buy_date',
        dataIndex: 'buy_date',
        align: 'center',
        render:(text: any, record)=>moment(record.buy_date).format('YYYY-MM-DD')
      },
      {
        title: '卖出日期',
        key: 'date',
        dataIndex: 'sell_date',
        align: 'center',
        render:(text: any, record)=>moment(record.sell_date).format('YYYY-MM-DD')
      },
      {
        title: '买入价格',
        dataIndex: 'buy_price',
        key: 'buy_price',
        align: 'right',
        render: (text: any, record) => numeralNum(record.buy_price)
      },
      {
        title: '卖出价格',
        dataIndex: 'sell_price',
        key: 'sell_price',
        align: 'right',
        render: (text: any, record) => numeralNum(record.sell_price)
      },
      {
        title: '交易量',
        dataIndex: 'value',
        key: 'value',
        align: 'right',
        render: (text: any, record) => numeralNum(record.value)
      },
      {
        title: '收益率',
        dataIndex: 'r',
        key: 'r',
        align: 'right',
        render: (text: any, record) => formatPercent(record.r),
      },
      {
        title: '盈亏金额',
        dataIndex: 'profit',
        key: 'profit',
        align: 'right',
        render: (text: any, record) => numeralNum(record.profit),
      },
      {
        title: '交易费用',
        dataIndex: 'fee',
        key: 'fee',
        align: 'right',
        render: (text: any, record) => numeralNum(record.fee)
      },
      {
        title: '成交类型',
        dataIndex: 'note',
        key: 'note',
        align: 'right',
      }
    ]

    return (
      <Row>
        <Col>
          <Table
            className={style.holdingFundTable}
            bordered
            size='small'
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            onRow={(row: holdingETF)=>{
              return {
                onClick: ()=>{this.onClick(row.secucode)}
              }
            }}
          />
        </Col>
        <Col offset={1}>
          <div>
            <Row>
              <Statistic
                className={style.statistic}
                title="ETF累计收益"
                value={this.state.total}
                precision={2}
              />
              <Statistic
                className={style.statistic}
                title="ETF操作胜率"
                value={this.state.win * 100}
                precision={0}
                suffix={'%'}
              />
              <Statistic
                className={style.statistic}
                title="所选基金累计收益"
                value={this.state.selected.total}
                precision={2}
              />
              <Statistic
                className={style.statistic}
                title="所选基金操作胜率"
                value={this.state.selected.win * 100}
                precision={0}
                suffix={'%'}
              />
            </Row>
          </div>
          <Table
            bordered
            size='small'
            columns={columns2}
            dataSource={this.state.selected.data}
            pagination={false}
          />
        </Col>
      </Row>
    );
  }
}
