import React from "react";
import { Table } from "antd";
import type {ColumnsType} from "antd/lib/table";
import api from "@/utils/http";
import * as numeral from "numeral";


export default class Transaction extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.setState({})
  }

  state = {
    data: []
  }

  fetchData = ()=>{
    const {port_code, secucode} = this.props
    if (secucode){
      api.get('/cta/transaction', {params: {port_code, secucode}}).then((r: any)=>{
        this.setState({data: r})
      })
    }
  }

  componentDidUpdate() {
    this.fetchData()
  }

  render() {

    const columns: ColumnsType<TransCtaType> = [
      {
        title: '序号',
        align: 'center',
        render: (_: any, record: any, index: number)=> `${index+1}`
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '买入金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (_, records)=> numeral(records.amount).format('0,000.00')
      },
      {
        title: '确认份额',
        dataIndex: 'share',
        key: 'share',
        align: 'right',
        render: (_, records)=> numeral(records.share).format('0,000.00')
      },
      {
        title: '委托价格',
        dataIndex: 'price',
        key: 'price',
        align: 'right'
      },
      {
        title: '确认日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
      },
    ]

    return (
      <>
        {this.props.secucode? <>
          <div>{this.props.secuabbr}</div>
          <Table
            size={'small'}
            bordered
            columns={columns}
            dataSource={this.state.data}
          />
        </>: <></>}
      </>
    );
  }
}
