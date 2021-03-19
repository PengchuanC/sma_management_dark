import React from 'react';
import { Spin } from 'antd';
import * as echarts from 'echarts';
import { basicSocket } from '@/utils/http';
import styles from './overiew.less';


export default class ChangeMonitorChart extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  state: {data: changeType[], ws: WebSocket} ={
    data: [],
    ws: new WebSocket(`${basicSocket}/prevaluation/`)
  }

  socketClient = () =>{
    const {ws} = this.state
    ws.onopen = () => ws.send(this.props.portCode)
    ws.onmessage = e => {
      const {data} = this.state
      const r = JSON.parse(e.data)
      if (r) {
        data.push(...r)
        this.setState({data})
        this.showChart(data)
      }
    }
  }

  showChart = (data: changeType[]) => {
    showChangeChart(data, this.ref.current)
  }

  componentDidMount() {
    this.socketClient()
  }

  componentWillUnmount() {
    this.state.ws.close()
  }

  render() {
    return (
      <div className={styles.chartWrapper}>
        {this.state.data.length > 0?
          <div className={styles.chart} ref={this.ref} />:
          <Spin className={styles.chart} style={{paddingTop: '120px'}}/>
        }
      </div>
    );
  }
}

export function showChangeChart(data: changeType[], ref: any) {
  const chart: echarts.ECharts = echarts.init(ref, 'dark');
  const options: echarts.EChartOption = {
    backgroundColor: '#2c343c',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      formatter: (params: any, ticket: string, callback: any) => {
        const obj = params[0]
        return `${obj.data[0]}: ${(obj.data[1] * 100).toFixed(2)}%`
      }
    },
    grid: {
      left: 60,
      top: 40,
      bottom: 30,
      right: 20
    },
    legend: {
      show: true,
      icon: 'line',
      top: 10
    },
    textStyle: {
      fontSize: 12
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      nameLocation: 'end',
      scale: true,
      axisLabel: {
        formatter: (value: number) => {
          return `${(value * 100 ).toFixed(2)  }%`
        }
      }
    },
    series: [
      {
        type: 'line',
        data: data.map(e=>[e.name, e.value]),
        name: '涨跌幅'
      }
    ]
  }
  chart.setOption(options);
}

