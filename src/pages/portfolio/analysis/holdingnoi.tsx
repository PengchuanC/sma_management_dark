import React from 'react';
import { Table, Col, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnalysisTabContext } from '@/utils/localstorage';
import http from '@/utils/http';
import { formatPercent, numeralNum } from '@/utils/util';
import style from './analysis.less'
import type moment from "moment";


export default class HoldingNOI extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state: {data: holdingNOI[], portCode: string, date: moment.Moment} = {
    portCode: this.props.portCode,
    date: this.context.date,
    data: [],
  }

  fetchData = ()=>{
    http.get('/analysis/fundholding/summary/', {
      params: {portCode: this.state.portCode, date: this.state.date.format('YYYY-MM-DD')}
    }).then((r)=>{
      this.setState({date: this.context.date, data: r.holding})
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
    const columns: ColumnsType<holdingNOI> = [
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
        title: '持仓市值(元)',
        dataIndex: 'mkt_cap',
        key: 'mkt_cap',
        align: 'right',
        render: (text: any, record: holdingNOI) => numeralNum(record.mkt_cap),
      },
      {
        title: '份额占比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: holdingNOI) => formatPercent(record.ratio),
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
            onRow={(row: holdingNOI)=>{
              return {
                onClick: ()=>{if (row.secucode){window.open(`http://product.nomuraoi-sec.com/info/${row.secucode}`)}}
              }
            }}
          />
        </Col>

      </Row>
    );
  }
}
