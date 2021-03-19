import NavChart from './nav_chart';
import http from '@/utils/http';
import styles from './overiew.less';
import * as echarts from 'echarts';


export default class AvgPosition extends NavChart {
  fetchData = ()=>{
    http.get('/overview/pos/', {params:{portCode: this.props.portCode}}).then(r=>{
      this.showChart(r.data)
    })
  }

  // @ts-ignore
  showChart = (data: avgPosType[]) => {
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
        right: 40
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
            return (value*100).toFixed(2)
          }
        }
      },
      series: [
        {
          type: 'line',
          data: data.map(x=>x.normal_stock),
          name: '普通股票'
        },{
          type: 'line',
          name: '偏股混合',
          data: data.map(x=>x.mix_stock)
        },{
          type: 'line',
          name: '平衡混合',
          data: data.map(x=>x.mix_equal)
        },{
          type: 'line',
          name: '灵活配置',
          data: data.map(x=>x.mix_flexible)
        }
      ]
    }
    chart.setOption(options);
  }

  render() {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chart} ref={this.ref} />
      </div>
    );
  }
}
