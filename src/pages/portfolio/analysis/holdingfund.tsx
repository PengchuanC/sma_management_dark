import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnalysisTabContext } from '@/utils/localstorage';
import http from '@/utils/http';
import { formatPercent, numeralNum } from '@/utils/util';
import style from './analysis.less'


function formatApply(num: number){
  if (num <= 100){
    return '不限制'
  }
  if (num < 10000) {
    return `${(num).toFixed(0)  }元`
  }
  if (num < 1000000) {
    return `${(num / 10000).toFixed(0)  }万元`
  }
  if (num < 10000000) {
    return `${(num / 1000000).toFixed(0)  }百万元`
  }
  if (num < 100000000) {
    return `${(num / 10000000).toFixed(0)  }千万元`
  }
  if (num > 100000000) {
    return `${(num / 100000000).toFixed(0)  }亿元`
  }

    return `${num  }元`

}


export default class HoldingFund extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state: {data: holdingFundType[], portCode: string, date: moment.Moment} = {
    portCode: this.props.portCode,
    date: this.context.date,
    data: [],
  }

  fetchData = ()=>{
    http.get('/analysis/fundholding/', {
      params: {portCode: this.state.portCode, date: this.state.date.format('YYYY-MM-DD')}
    }).then((r)=>{
      this.setState({date: this.context.date, data: r})
    })
  }

  componentDidUpdate() {
    if (this.state.date.date() !== this.context.date.date()) {
      this.fetchData()
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const columns: ColumnsType<holdingFundType> = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
        width: 70
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '基金名称',
        dataIndex: 'secuname',
        key: 'secuname',
        align: 'left',
        width: 160
      },
      {
        title: '基金类型',
        dataIndex: 'category',
        key: 'category',
        align: 'left',
        width: 120
      },
      {
        title: '持仓市值',
        dataIndex: 'mkt_cap',
        key: 'mkt_cap',
        align: 'right',
        render: (text: any, record: holdingFundType) => numeralNum(record.mkt_cap),
      },
      {
        title: '持仓占比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.ratio),
        sorter: (a: holdingFundType, b: holdingFundType) => a.ratio - b.ratio,
      },
      {
        title: '日收益',
        dataIndex: 'day',
        key: 'day',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.day),
        sorter: (a: holdingFundType, b: holdingFundType) => a.day - b.day,
      },
      {
        title: '近一周',
        dataIndex: 'week',
        key: 'week',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.week),
        sorter: (a: holdingFundType, b: holdingFundType) => a.week - b.week,
      },
      {
        title: '近一月',
        dataIndex: 'month',
        key: 'month',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.month),
        sorter: (a: holdingFundType, b: holdingFundType) => a.month - b.month,
      },
      {
        title: '近一季',
        dataIndex: 'quarter',
        key: 'quarter',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.quarter),
        sorter: (a: holdingFundType, b: holdingFundType) => a.quarter - b.quarter,
      },
      {
        title: '近半年',
        dataIndex: 'half_year',
        key: 'half_year',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.half_year),
        sorter: (a: holdingFundType, b: holdingFundType) => a.half_year - b.half_year,
      },
      {
        title: '近一年',
        dataIndex: 'year',
        key: 'year',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.year),
        sorter: (a: holdingFundType, b: holdingFundType) => a.year - b.year,
      },
      {
        title: 'YTD',
        dataIndex: 'ytd',
        key: 'ytd',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatPercent(record.ytd),
        sorter: (a: holdingFundType, b: holdingFundType) => a.ytd - b.ytd,
      },
      {
        title: '申购状态',
        dataIndex: 'apply_type',
        key: 'apply_type',
        align: 'right',
      },
      {
        title: '赎回状态',
        dataIndex: 'redeem_type',
        key: 'redeem_type',
        align: 'right',
      },
      {
        title: '申购起点',
        dataIndex: 'min_apply',
        key: 'min_apply',
        align: 'right',
        render: (text: any, record: holdingFundType) => numeralNum(record.min_apply),
        sorter: (a: holdingFundType, b: holdingFundType) => a.min_apply - b.min_apply,
      },
      {
        title: '单日限额',
        dataIndex: 'max_apply',
        key: 'max_apply',
        align: 'right',
        render: (text: any, record: holdingFundType) => formatApply(record.max_apply),
        sorter: (a: holdingFundType, b: holdingFundType) => a.max_apply - b.max_apply,
      },
    ]
    return (
      <Table
        className={style.holdingFundTable}
        // style={{maxHeight: windowHeight}}
        bordered
        size='small'
        columns={columns}
        dataSource={this.state.data}
        pagination={{defaultPageSize: 100, pageSizeOptions: ['15', '30', '50', '100', '200']}}
        onRow={(row: holdingFundType)=>{
          return {
            onClick: ()=>{window.open(`http://product.nomuraoi-sec.com/factsheet/${row.secucode}.OF`) }
          }
        }}
      />
    );
  }
}
