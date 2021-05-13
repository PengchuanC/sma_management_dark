import React from "react";
import styles from "@/pages/portfolio/overview/overiew.less";
import * as echarts from 'echarts';
import http from '@/utils/http';
import numeral from 'numeral';


export default class AllocateHistory extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  fetchData = ()=>{
    http.get('/overview/allocate/history/', {params:{portCode: this.props.portCode}}).then(r=>{
      this.showChart(r.data)
    })
  }

  showChart = (data: allocateType[]) => {
    const chart: echarts.ECharts = echarts.init(this.ref.current, 'dark');
    const options: echarts.EChartOption = {
      backgroundColor: '#2c343c',
      tooltip: {
        trigger: 'axis',
        position (pt) {
          return [pt[0], '10%'];
        },
        formatter(params: any){
          let res = params[0].name;
          let sum = 0
          for (let i = 0; i < params.length; i+=1) {
            res += `<div style='text-align: left'>${params[i].marker}${params[i].seriesName}：${ numeral(params[i].data).format('0.00%')}`;
            sum += Number(params[i].data)
          }
          res += `<br>合计: ${  numeral(sum).format('0.00%')}</div>`
          return res;
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
            return `${(value*100).toFixed(0)  }%`
          }
        }
      },
      series: [
        {
          type: 'line',
          data: data.map(x=>x.equity),
          name: '权益',
          stack: '仓位',
          areaStyle: {},
        },
        {
          type: 'line',
          data: data.map(x=>x.fix_income),
          name: '固收',
          stack: '仓位',
          areaStyle: {},
        },
        {
          type: 'line',
          data: data.map(x=>x.alter),
          name: '另类',
          stack: '仓位',
          areaStyle: {},
        },
        {
          type: 'line',
          data: data.map(x=>x.money),
          name: '现金',
          stack: '仓位',
          areaStyle: {},
        },
        {
          type: 'line',
          data: data.map(x=>x.other),
          name: '其他',
          stack: '仓位',
          areaStyle: {},
        },
      ]
    }
    chart.setOption(options);
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (<>
      <div className={styles.chartWrapper}>
        <div className={styles.chart} ref={this.ref} />
      </div>
    </>);
  }
}
