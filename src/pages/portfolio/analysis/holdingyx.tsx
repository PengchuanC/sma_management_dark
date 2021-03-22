import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnalysisTabContext } from '@/utils/localstorage';
import http from '@/utils/http';
import { formatPercent, numeralNum } from '@/utils/util';
import style from './analysis.less'
import type moment from "moment";


export default class HoldingYX extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state: {data: holdingFundTypeYX[], portCode: string, date: moment.Moment} = {
    portCode: this.props.portCode,
    date: this.context.date,
    data: [],
  }

  fetchData = ()=>{
    http.get('/analysis/fundholding/yx/', {
      params: {portCode: this.state.portCode, date: this.state.date.format('YYYY-MM-DD')}
    }).then((r)=>{
      this.setState({date: this.context.date, data: r.data})
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
    const columns: ColumnsType<holdingFundTypeYX> = [
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
        title: '持仓市值',
        dataIndex: 'mkt_cap',
        key: 'mkt_cap',
        align: 'right',
        render: (text: any, record: holdingFundTypeYX) => numeralNum(record.mkt_cap),
      },
      {
        title: '全部份额',
        dataIndex: 'holding_value',
        key: 'holding_value',
        align: 'right',
        render: (text: any, record: holdingFundTypeYX) => numeralNum(record.holding_value),
      },
      {
        title: '宜信份额',
        dataIndex: 'shares',
        key: 'shares',
        align: 'right',
        render: (text: any, record: holdingFundTypeYX) => numeralNum(record.shares),
      },
      {
        title: '份额占比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: holdingFundTypeYX) => formatPercent(record.ratio),
        sorter: (a: holdingFundTypeYX, b: holdingFundTypeYX) => a.ratio - b.ratio,
      }
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
        onRow={(row: holdingFundTypeYX)=>{
          return {
            onClick: ()=>{window.open(`http://product.nomuraoi-sec.com/factsheet/${row.secucode}.OF`) }
          }
        }}
      />
    );
  }
}
