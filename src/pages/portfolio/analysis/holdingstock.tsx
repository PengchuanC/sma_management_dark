import React from 'react';
import { Table, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnalysisTabContext } from '@/utils/localstorage';
import { formatPercent } from '@/utils/util';
import http from '@/utils/http';
import style from './analysis.less';
import { sum } from 'lodash';
import type { Moment } from 'moment';


export default class HoldingStock extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state: {portCode: string, date: Moment, stock: holdingStockType[], industry: industryType[]} = {
    portCode: this.props.portCode,
    date: this.context.date,
    stock: [],
    industry: []
  }

  fetchData = ()=>{
    http.get('/analysis/fundholding/stock/', {
      params: {portCode: this.state.portCode, date: this.state.date.format('YYYY-MM-DD')}
    }).then(r=>{
      this.setState({date: this.context.date, stock: r.stock, industry: r.industry})
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
    const columns: ColumnsType<holdingStockType> = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '股票代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '股票名称',
        dataIndex: 'secuname',
        key: 'secuname',
        align: 'left',
      },
      {
        title: '占净值比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: holdingStockType) => formatPercent(record.ratio),
        sorter: (a: holdingStockType, b: holdingStockType) => a.ratio - b.ratio,
      },
      {
        title: '占净值比累计',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: holdingStockType) => formatPercent(record.cumsum),
        sorter: (a: holdingStockType, b: holdingStockType) => a.cumsum - b.cumsum,
      },
      {
        title: '占权益比',
        dataIndex: 'ofnv',
        key: 'ofnv',
        align: 'right',
        render: (text: any, record: holdingStockType) => formatPercent(record.ofnv),
        sorter: (a: holdingStockType, b: holdingStockType) => a.ofnv - b.ofnv,
      },
      ]
    const columns2: ColumnsType<industryType> = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '行业名称',
        dataIndex: 'firstindustryname',
        key: 'firstindustryname',
        align: 'left',
      },
      {
        title: '占净值比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: industryType) => formatPercent(record.ratio),
        sorter: (a: industryType, b: industryType) => a.ratio - b.ratio,
      },
      {
        title: '占权益市值比',
        dataIndex: 'ratioinequity',
        key: 'ratioinequity',
        align: 'right',
        render: (text: any, record: industryType) => formatPercent(record.ratioinequity),
      },
      {
        title: '100%化占比',
        dataIndex: 'scaled_ratio',
        key: 'scaled_ratio',
        align: 'right',
        render: (text: any, record: industryType) => formatPercent(record.scaled_ratio),
        sorter: (a: industryType, b: industryType) => a.scaled_ratio - b.scaled_ratio,
      },
      // {
      //   title: '中证800配置',
      //   dataIndex: 'weight',
      //   key: 'weight',
      //   align: 'right',
      //   render: (text: any, record: industryType) => formatPercent(record.weight),
      // },
      // {
      //   title: '100化-中证800',
      //   dataIndex: 'diff',
      //   key: 'diff',
      //   align: 'right',
      //   render: (text: any, record: industryType) => formatPercent(record.diff),
      // },
    ]
    return (
      <Row>
        <Col span={10}>
          <Table
            className={style.holdingFundTable}
            bordered
            size='small'
            columns={columns}
            dataSource={this.state.stock}
            pagination={{defaultPageSize: 30, pageSizeOptions: ['15', '30', '50', '100', '200']}}
            // style={{maxHeight: windowHeight}}
          />
        </Col>
        <Col span={13} offset={1}>
          <Table
            className={style.holdingFundTable}
            bordered
            size='small'
            columns={columns2}
            dataSource={this.state.industry}
            pagination={false}
            // style={{maxHeight: windowHeight}}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
                <Table.Summary.Cell index={2} className={style.summaryRight}>{formatPercent(sum(this.state.industry.map(e=>e.ratio)))}</Table.Summary.Cell>
                <Table.Summary.Cell index={3} className={style.summaryRight}>{formatPercent(sum(this.state.industry.map(e=>e.ratioinequity)))}</Table.Summary.Cell>
                <Table.Summary.Cell index={4} className={style.summaryRight}>{formatPercent(sum(this.state.industry.map(e=>e.scaled_ratio)))}</Table.Summary.Cell>
                {/* <Table.Summary.Cell index={5} className={style.summaryRight}>{formatPercent(sum(this.state.industry.map(e=>e.weight)))}</Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={6} className={style.summaryRight}>{formatPercent(sum(this.state.industry.map(e=>e.diff)))}</Table.Summary.Cell> */}
              </Table.Summary.Row>
            )}
          />
        </Col>
      </Row>
    );
  }
}
