import React from 'react';
import * as echarts from 'echarts';
import http from '@/utils/http';
import styles from './overiew.less';


export default class NavChart extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  state = {
    base: ''
  }

  fetchData = ()=>{
    http.get('/overview/', {params:{portCode: this.props.portCode}}).then(r=>{
      this.showChart(r.data)
      this.setState({base: r.base})
    })
  }

  showChart = (data: navType[]) => {
    const chart: echarts.ECharts = echarts.init(this.ref.current, 'dark');
    const options: echarts.EChartOption = {
      backgroundColor: '#2c343c',
      tooltip: {
        trigger: 'item',
        position (pt) {
          return [pt[0], '10%'];
        }
      },
      grid: {
        left: 60,
        top: 40,
        bottom: 30,
        right: 20
      },
      legend : {
        show : true,
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
        data: data.map(x=>x.date),
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        nameLocation: 'end',
        scale: true,
        axisLabel: {
          formatter: (value: number)=>{
            return value.toFixed(4)
          }
        }
      },
      series: [
          {
            type: 'line',
            data: data.map(x=>x.p),
            name: '组合'
          }
        ]
    }
    chart.setOption(options);
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chart} ref={this.ref} />
        {/* <p className={styles.chartEx}>基准：{this.state.base}</p> */}
      </div>
    );
  }
}

