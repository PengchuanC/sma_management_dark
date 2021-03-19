import React from 'react';
import { Select, DatePicker, Card, Empty } from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';
import http from '@/utils/http';
import styles from './capitalflow.less';

const { Option } = Select;

const height = `${window.innerHeight - 64 - 30 - 200}px`;

// 单个行业近一个季度资金流入流出情况
export default class Industry extends React.Component<any, any> {
  ref: React.RefObject<any> = React.createRef();

  state = {
    date: '',
    categories: [],
    slCategory: '',
    slDate: '',
    show: true,
  };

  // 初始化时获取全部申万行业
  fetchCategories = () => {
    http.get('/capital/category/').then(resp => {
      this.setState({ categories: resp.data });
    });
  };

  // 获取行业资金流向数据
  fetchData = (category: string, date: string) => {
    http
      .get('/capital/', {
        params: { category, date },
      })
      .then(r => {
        if (this.state.show) {
          this.setState({ show: false });
        }
        this.showChart(r);
      });
  };

  // 绘图
  showChart = (d: any) => {
    const { data, max1, max2 } = d;
    const chart: echarts.ECharts = echarts.init(this.ref.current, 'dark');
    const options: echarts.EChartOption = {
      backgroundColor: '#2c343c',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        show: true,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      legend: {
        show: true,
        left: 'center',
        top: 'top',
      },
      color: ['#749f83', '#91c7ae', '#c23531', '#61a0a8', '#ca8622', '#749f83'],
      xAxis: {
        type: 'category',
        data: data.map((x: { date: any }) => x.date),
      },
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: '资金(百万元)',
          boundaryGap: false,
          splitLine: {
            show: false,
          },
          max: max1,
          min: -max1,
        },
        {
          type: 'value',
          scale: true,
          name: '涨跌幅(%)',
          boundaryGap: false,
          splitLine: {
            show: false,
          },
          max: max2,
          min: -max2,
        },
      ],
      series: [
        {
          data: data.map((x: { MA5_LOW: number }) => x.MA5_LOW),
          type: 'line',
          stack: '1',
          name: '下沿',
          lineStyle: {
            opacity: 0,
          },
          areaStyle: {
            color: '#8c8c8c',
          },
          symbol: 'none',
          yAxisIndex: 0,
        },
        {
          data: data.map(
            (x: { MA5_HIGH: number; MA5_LOW: number }) => x.MA5_HIGH,
          ),
          type: 'line',
          stack: '2',
          name: '上沿',
          lineStyle: {
            opacity: 0,
          },
          areaStyle: {
            color: '#8c8c8c',
          },
          symbol: 'none',
          yAxisIndex: 0,
        },
        {
          name: 'MA3',
          data: data.map((x: { MA3: number }) => x.MA3),
          type: 'line',
          symbol: 'none',
          yAxisIndex: 0,
        },
        {
          name: 'MA5',
          data: data.map((x: { MA5: number }) => x.MA5),
          type: 'line',
          symbol: 'none',
          yAxisIndex: 0,
        },
        {
          name: 'MA10',
          data: data.map((x: { MA10: number }) => x.MA10),
          type: 'line',
          symbol: 'none',
          yAxisIndex: 0,
        },
        {
          name: '涨跌幅',
          data: data.map((x: { change: any }) => x.change),
          type: 'bar',
          yAxisIndex: 1,
        },
      ],
    };
    chart.setOption(options);
  };

  // 响应行业选择事件
  onSelectCategory = (e: string) => {
    this.fetchData(e, this.state.slDate);
    this.setState({ slCategory: e });
  };

  // 响应选择区间尾日
  onSelectDate = (e: any) => {
    const d = moment(e).format('YYYY-MM-DD');
    this.fetchData(this.state.slCategory, d);
    this.setState({ slDate: d });
  };

  componentDidMount() {
    this.fetchCategories();
  }

  render() {
    return (
      <>
        <Select
          placeholder="请选择行业"
          style={{ width: '200px' }}
          onChange={this.onSelectCategory}
        >
          {this.state.categories.map((x, idx) => {
            return (
              <Option value={x} key={idx}>
                {x}
              </Option>
            );
          })}
        </Select>
        <DatePicker
          className={styles.datePicker}
          placeholder="请选择区间尾日"
          onChange={this.onSelectDate}
        />
        <Card
          size="small"
          bordered={false}
          className={styles.card}
          style={{ height }}
        >
          <div
            ref={this.ref}
            className={styles.chart}
            style={{ height }}
          />
          <Empty
            className={this.state.show ? styles.empty : styles.emptyHide}
            description={
              <span className={styles.describe}>暂无数据，请选择行业</span>
            }
          />
        </Card>
      </>
    );
  }
}
