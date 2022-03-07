import React from "react";
import {Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import {formatPercent, numeralNum} from "@/utils/util";
import api from "@/utils/http";
import Transaction from "@/pages/portfolio/cta/transaction";

export default class CtaHolding extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.setState({port_code: props.port_code})
  }

  state = {
    port_code: '11111',
    data: [],
    secucode: '',
    secuabbr: ''
  }

  fetch = ()=>{
    api.get('/cta/holding/', {params: {port_code: this.props.port_code}}).then(r=>{
      this.setState({data: r})
    })
  }

  componentDidMount() {
    this.fetch()
  }

  render() {

    const columns: ColumnsType<holdingCtaType> = [
      {
        title: '序号',
        align: 'center',
        render: (_, record, index)=> `${index+1}`
      },
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
        width: 300
      },
      {
        title: '净值日期',
        dataIndex: 'recent',
        key: 'recent',
        align: 'center',
        // width: 140
      },
      {
        title: '持仓市值',
        dataIndex: 'mkt_cap',
        key: 'mkt_cap',
        align: 'right',
        // width: 100,
        render: (_, record: holdingCtaType) => numeralNum(record.mkt_cap),
      },
      {
        title: '持仓占比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        // width: 100,
        render: (_, record: holdingCtaType) => formatPercent(record.ratio),
        sorter: (a: holdingCtaType, b: holdingCtaType) => a.ratio - b.ratio,
      },
      {
        title: '近一周',
        dataIndex: 'week',
        key: 'week',
        align: 'right',
        render: (_, record: holdingCtaType) => formatPercent(record.week),
        sorter: (a: holdingCtaType, b: holdingCtaType) => a.week - b.week,
      },
      {
        title: '近一月',
        dataIndex: 'month',
        key: 'month',
        align: 'right',
        render: (_, record: holdingCtaType) => formatPercent(record.month),
        sorter: (a: holdingCtaType, b: holdingCtaType) => a.month - b.month,
      },
      {
        title: '近一季',
        dataIndex: 'quarter',
        key: 'quarter',
        align: 'right',
        render: (_, record: holdingCtaType) => formatPercent(record.quarter),
        sorter: (a: holdingCtaType, b: holdingCtaType) => a.quarter - b.quarter,
      },
      {
        title: '近一年',
        dataIndex: 'last_year',
        key: 'last_year',
        align: 'right',
        render: (_, record: holdingCtaType) => formatPercent(record.last_year),
        sorter: (a: holdingCtaType, b: holdingCtaType) => a.last_year - b.last_year,
      },
      {
        title: 'YTD',
        dataIndex: 'ytd',
        key: 'ytd',
        align: 'right',
        render: (_, record: holdingCtaType) => formatPercent(record.ytd),
        sorter: (a: holdingCtaType, b: holdingCtaType) => a.ytd - b.ytd,
      },
      {
        title: '成立以来',
        dataIndex: 'si',
        key: 'si',
        align: 'right',
        render: (_, record: holdingCtaType) => formatPercent(record.ytd),
        sorter: (a: holdingCtaType, b: holdingCtaType) => a.ytd - b.ytd,
      },
    ]

    return (
      <>
        <Table
          columns={columns}
          bordered
          size='small'
          dataSource={this.state.data}
          onRow={(record: holdingCtaType)=>{
            return {
              onClick: ()=>{
                this.setState({secucode: record.secucode, secuabbr: record.secuabbr})
              }
            }
          }}
        />

        <Transaction port_code={this.props.port_code} secucode={this.state.secucode} secuabbr={this.state.secuabbr} />
      </>
    );
  }
}
