// eslint-disable-next-line max-classes-per-file
import React from 'react';
import * as echarts from 'echarts';
import { DatePicker, Space } from 'antd';
import http from '@/utils/http';
import numeral from 'numeral';
import styles from './overiew.less';
import Cache from "@/utils/localstorage";


const { RangePicker } = DatePicker;


export default class AllocateChart extends React.Component<any, any> {

  protected ref: React.RefObject<any> = React.createRef()

  state = {
    lever: 0
  }

  showChart = (data: assetType[]) => {
    const chart: echarts.ECharts = echarts.init(this.ref.current, 'dark');
    const options: any = {
      backgroundColor: '#2c343c',
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formatter (params: any, ticket: any, callback: any){
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const {data} = params
          const {name} = data
          const value = (data.value * 100).toFixed(2)
          return `${name}: ${value}%`
        }
      },
      // color: ['#900000','#c00000', '#D18484', '#E0B5B5', '#FFB6C1'],
      textStyle: {
        fontSize: 12
      },
      title: {
        text: '单位：%',
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      grid: {
      },
      legend: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        fontSize: 10,
        textStyle: {
          align: 'left',
          lineHeight: 12,
          justifyItems: 'center'
        },
        itemWidth: 16,
        itemHeight: 12,
      },
      series: {
        type: 'pie',
        radius: ['35%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'inner',
          formatter: (index: any)=> numeral(index.value).format('0.00%')
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '15',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        center: ['35%', '50%'],
        data
      }
    }
    chart.setOption(options);
  }

  fetchData = ()=>{
    const portCode = Cache.getDefaultPortcode()
    http.get('/overview/allocate/', {params: {portCode}}).then(r=>{
      this.setState({lever: r.lever})
      this.showChart(r.data)
    })
  }

  public componentDidMount() {
    this.fetchData()
  }

  public render() {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.pieChartWrapper}>
          <div className={styles.pieChartFix}>
            <div className={styles.pieChart} ref={this.ref} />
          </div>
          <div className={styles.pieChartNotify}>
            <p>当前资产配置符合契约限制</p>
            <p>当前杠杆比例为：{this.state.lever}</p>
          </div>
        </div>
      </div>
    );
  }
}


export class AvgAllocate extends AllocateChart {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDateRangeChange = (values: any, formatString: [string, string])=>{
    const start = values[0]?.format('YYYY-MM-DD')
    const end = values[1]?.format('YYYY-MM-DD')
    http.get('/overview/allocate/avg/', {params: {portCode: this.props.portCode, start, end}}).then(r=>{
      this.showChart(r.data)
    })
  }

  fetchRangeData = (start: string, end: string)=>{
    const portCode = Cache.getDefaultPortcode()
    http.get('/overview/allocate/avg/', {params: {portCode, start, end}}).then(r=>{
      this.showChart(r.data)
    })
  }

  public componentDidMount() {
    this.fetchRangeData('', '')
  }

  public render() {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.pieChartWrapper}>
          <div className={styles.pieChartFix}>
            <div className={styles.pieChart} ref={this.ref} />
          </div>
          <div className={styles.pieChartNotify}>
            <Space>
              <RangePicker onChange={this.onDateRangeChange} />
            </Space>
          </div>
        </div>
      </div>
    );
  }
}
