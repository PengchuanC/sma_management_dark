import React from 'react';
import {Select, Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnalysisTabContext } from '@/utils/localstorage';
import http from '@/utils/http';
import { formatPercent, numeralNum } from '@/utils/util';
import style from './analysis.less'


const { Option } = Select


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

  state: {data: holdingFundType[], portCode: string, date: moment.Moment, portfolios: any} = {
    portCode: this.props.portCode,
    date: this.context.date,
    data: [],
    portfolios: [],
  }


  fetchData = ()=>{
    http.get('/analysis/fundholding/', {
      params: {portCode: this.state.portCode, date: this.state.date.format('YYYY-MM-DD')}
    }).then((r)=>{
      this.setState({date: this.context.date, data: r})
    })
  }

  fetchPortfolios = () => {
    http.get('/basic/all/').then((r)=>{
      const { data } = r
      const portfolios = data.map((x: any)=>{ return {name: x.port_name, value: x.port_code}})
      this.setState({portfolios})
    })
  }

  selectPortfolio = (value: string) => {
    http.get('/analysis/fundholding/', {
      params: {portCode: value, date: this.state.date.format('YYYY-MM-DD')}
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
    this.fetchPortfolios()
  }

  render() {
    const columns: ColumnsType<holdingFundType> = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
        width: 60
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
        render:(text)=>{
          return <div className={style.clickable} onClick={()=>{window.open(`http://product.nomuraoi-sec.com/info/${text}`)}}>{text}</div>
        },
      },
      {
        title: '基金名称',
        dataIndex: 'secuname',
        key: 'secuname',
        align: 'left',
        width: 140
      },
      {
        title: '基金类型',
        dataIndex: 'branch',
        key: 'branch',
        align: 'left',
        width: 100,
        filters: [{text: '股票型', value: '股票型'}, {text: '债券型', value: '债券型'}, {text: '另类', value: '另类'}, {text: '货币型', value: '货币型'}, {text: 'QDII型', value: 'QDII型'}, {text: 'FOF型', value: 'FOF型'}],
        onFilter: (value: any, record)=> record.branch === value
      },
      {
        title: '二级分类',
        dataIndex: 'classify',
        key: 'classify',
        align: 'left',
        width: 100,
        sorter: (a: holdingFundType, b: holdingFundType) => a.classify.localeCompare(b.classify),
      },
      {
        title: '持仓市值',
        dataIndex: 'mkt_cap',
        key: 'mkt_cap',
        align: 'right',
        width: 100,
        render: (text: any, record: holdingFundType) => numeralNum(record.mkt_cap),
      },
      {
        title: '持仓占比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        width: 100,
        render: (text: any, record: holdingFundType) => formatPercent(record.ratio),
        sorter: (a: holdingFundType, b: holdingFundType) => a.ratio - b.ratio,
      },
      {
        title: '累计收益',
        dataIndex: 'total_profit',
        key: 'total_profit',
        align: 'right',
        width: 100,
        render: (text: any, record: holdingFundType) => numeralNum(record.total_profit),
        sorter: (a: holdingFundType, b: holdingFundType) => a.total_profit - b.total_profit,
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
        width: 80,
        render: (text: any, record: holdingFundType) => numeralNum(record.min_apply),
      },
      {
        title: '单日限额',
        dataIndex: 'max_apply',
        key: 'max_apply',
        align: 'right',
        width: 80,
        render: (text: any, record: holdingFundType) => formatApply(record.max_apply),
      },
    ]
    return (
      <>
        <Select style={{width: 200}} placeholder='选择组合' onSelect={this.selectPortfolio}>
          {this.state.portfolios.map((x: any)=>{
            return (<Option key={x.value} value={x.value}>{x.name}</Option>)
          })}
        </Select>
        <Table
          className={style.holdingFundTable}
          scroll={{y: 490}}
          bordered
          size='small'
          columns={columns}
          dataSource={this.state.data}
          pagination={{defaultPageSize: 100, pageSizeOptions: ['15', '30', '50', '100', '200']}}
        />
      </>
    );
  }
}
