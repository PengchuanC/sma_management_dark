import React from 'react'
import styles from './mock.less';
import { Button, Table, Card, Select, Row, Col, Statistic } from 'antd';
import http from '@/utils/http';
import {columns2} from '@/pages/allocate/backtest';
import * as echarts from 'echarts';
import Cache from "@/utils/localstorage";
import {PageContainer} from "@ant-design/pro-layout";

interface transType {
  secucode: string,
  operation: string,
  amount: number,
  measure: string
}

const { Option } = Select;

export default class Overview extends React.Component<any, any> {

  state = {
    loading: false,
    portCode: Cache.getDefaultPortcode(),
    date: [],
    selectedDate: '',
    detail: [],
    perf: [],
    nav: [],
    last: ''
  }

  ref: React.RefObject<any> = React.createRef();

  // 获取全部调仓日期
  getDate = ()=>{
    http.get('/mock/date/', {params:{portCode: this.state.portCode}}).then(r=>{
      this.setState({date: r.data})
    })
  }

  selectDate = (e: string) => {
    this.getDetail(e)
  }

  // 获取单日调仓记录
  getDetail = (d: string) => {
    http.get('/mock/detail/', {params:{portCode: this.state.portCode, date: d}}).then(r=>{
      this.setState({detail: r.data, selectedDate: d})
    })
  }

  // 提交选择
  submit = ()=>{
    this.setState({loading: true})
    http.get('/mock/', {params:{portCode: this.state.portCode, date: this.state.selectedDate}}).then(r=>{
      this.showChart(r.data)
      this.setState({nav: r.data, loading: false, perf: r.perf, last: r.last})
    })
  }

  // 画图
  showChart = (data: any) => {
    const chart: any = echarts.init(this.ref.current, 'dark');
    let option = {
      backgroundColor: '#2c343c',
      grid: {
        left: 50,
        right: 40
      },
      legend: {
        show: true,
        icon: 'line',
        top: 10,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data.map((x: any) => x.date),
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
        },
        axisLine: {
          lineStyle: {
            color: '#A6A6A6',
          },
        },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => {
            return value.toFixed(2);
          },
        },
        axisLine: {
          lineStyle: {
            color: '#A6A6A6',
          },
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '调仓组合',
          data: data.map((x: any) => x['调仓组合']),
          type: 'line'
        },
        {
          name: '不调仓组合',
          data: data.map((x: any) => x['不调仓组合']),
          type: 'line'
        }
      ],
    };
    chart.setOption(option);
    window.addEventListener('resize', () => {
      chart.resize();
    });
    this.setState({});
  }

  componentDidMount() {
    this.getDate()
  }

  render() {
    const portName = localStorage.getItem('portName') || ''
    return (
      <PageContainer title={portName}>
        <div className={styles.contentArea}>
          <Row>
            <Col>
              <Select bordered placeholder='选择调仓日期' className={styles.selectDate} onChange={this.selectDate}>
                {this.state.date.map((e: string, idx: number)=>{return <Option key={idx} value={e} title={e}>{e}</Option>})}
              </Select>
            </Col>
            <Col>
              <Button type={'primary'} className={styles.startMock} loading={this.state.loading} onClick={this.submit}>开始模拟</Button>
            </Col>
          </Row>
          <Card
            className={styles.mockItems}
            headStyle={{
              fontSize: '14px',
              padding: '0 20px',
              // backgroundColor: '#fafafa',
            }}
            bodyStyle={{ padding: '0', height: 0 }}
            size='small'
            title={'交易记录'}
          />
          <div className={styles.statisticCardWrapper}>
            {this.state.detail.map((e: transType, idx)=>{return <Card key={idx} bodyStyle={{width: 'fit-content'}}><Statistic suffix={e.measure} title={`${e.secucode}(${e.operation})`} value={e.amount} precision={0} className={styles.statisticCard} /></Card>})}
          </div>
          <Table bordered className={styles.mockItems} size='small' pagination={false} columns={columns2} dataSource={this.state.perf} />
          <Card
            className={styles.mockItems}
            headStyle={{
              fontSize: '14px',
              padding: '0 20px',
              // backgroundColor: '#fafafa',
            }}
            bodyStyle={{ padding: '0 0', height: '450px' }}
            size='small'
            title={'回测业绩对比'}
          >
            <div ref={this.ref} className={styles.chart} />
          </Card>
          <p>截至: {this.state.last}</p>
        </div>
      </PageContainer>
    )
  }
}
