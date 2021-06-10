// eslint-disable-next-line max-classes-per-file
import React from 'react';
import { Row, Col, Spin, Button, Radio } from 'antd';
import * as echarts from 'echarts';
import numeral from 'numeral';
import style from './analysis.less'
import { AnalysisTabContext } from '@/utils/localstorage';
import http from '@/utils/http';
import { warning } from '@/utils/util';
import moment from "moment";

const performance: performanceType = {
  acc_return_yield: { b: 0, p: 0 },
  annualized_return_yield: { b: 0, p: 0 },
  annualized_volatility: { b: { downside_vol: 0, vol: 0 }, p: { downside_vol: 0, vol: 0 } },
  calmar_ratio: { b: 0, p: 0 },
  cvar: { b: 0, p: 0 },
  daily_change: { b: { max: 0, mean: 0, min: 0, win_ratio: 0 }, p: { max: 0, mean: 0, min: 0, win_ratio: 0 } },
  max_drawback: { b: { drawback: 0, end: '', start: '' }, p: { drawback: 0, end: '', start: '' } },
  dcr: {p: 0},
  ucr: {p: 0},
  sharpe_ratio: { b: 0, p: 0 },
  sortino_ratio: { b: 0, p: 0 },
  trading_day_count: { b: { draw: 0, lose: 0, win: 0 }, p: { draw: 0, lose: 0, win: 0 } },
  var: { b: 0, p: 0 }
}

function percent(value: number) {
  return numeral(value).format('0.00%')
}

class PerformanceTable extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state = {
    data: performance,
    finish: false,
    date: this.context.date,
    needUpdate: true,
  }

  // 获取组合业绩值表评估数据
  fetchData = () => {
    this.setState({finish: false})
    http.get('/analysis/performance/', {
      params:{date: this.context.date.format("YYYY-MM-DD"), portCode: this.props.portCode}
    }).then(r=>{
      this.setState({data: r, finish: true, date: this.context.date})
    })
  }

  componentDidUpdate() {
    if (this.context.date.date() !== this.state.date.date() && this.state.finish) {
      this.fetchData()
    }
  }

  componentDidMount() {
    this.fetchData()
  }


  render() {
    const d: performanceType = this.state.data
    return (
      !this.state.finish || d === undefined? <Spin className={style.spin} />:
          <div className={style.performance}>
            <Button className={style.button}>主要业绩指标</Button>
            <table cellSpacing="1">
              <tbody>
              <tr>
                <th>业绩指标</th>
                <th>指标</th>
                <th>组合</th>
                <th>参考</th>
              </tr>
              <tr>
                <td rowSpan={6} className={style.greyBg}>收益指标</td>
                <td>累计收益</td>
                <td>{percent(d.acc_return_yield.p)}</td>
                <td>{percent(d.acc_return_yield.b)}</td>
              </tr>
              <tr>
                <td>年化收益</td>
                <td>{percent(d.annualized_return_yield.p)}</td>
                <td>{percent(d.annualized_return_yield.b)}</td>
              </tr>
              <tr>
                <td>平均单日收益</td>
                <td>{percent(d.daily_change.p.mean)}</td>
                <td>{percent(d.daily_change.b.mean)}</td>
              </tr>
              <tr>
                <td>最大单日收益</td>
                <td>{percent(d.daily_change.p.max)}</td>
                <td>{percent(d.daily_change.b.max)}</td>
              </tr>
              <tr>
                <td>最大单日损失</td>
                <td>{percent(d.daily_change.p.min)}</td>
                <td>{percent(d.daily_change.b.min)}</td>
              </tr>
              <tr>
                <td>单日收益胜率</td>
                <td>{percent(d.daily_change.p.win_ratio)}</td>
                <td>{percent(d.daily_change.b.win_ratio)}</td>
              </tr>
              <tr>
                <td rowSpan={3}>交易日指标</td>
                <td>上涨</td>
                <td>{d.trading_day_count.p.win}</td>
                <td>{d.trading_day_count.b.win}</td>
              </tr>
              <tr>
                <td>下跌</td>
                <td>{d.trading_day_count.p.lose}</td>
                <td>{d.trading_day_count.b.lose}</td>
              </tr>
              <tr>
                <td>收平</td>
                <td>{d.trading_day_count.p.draw}</td>
                <td>{d.trading_day_count.b.draw}</td>
              </tr>
              <tr>
                <td rowSpan={7}>波动指标</td>
                <td>年化波动</td>
                <td>{percent(d.annualized_volatility.p.vol)}</td>
                <td>{percent(d.annualized_volatility.b.vol)}</td>
              </tr>
              <tr>
                <td>年化下行波动</td>
                <td>{percent(d.annualized_volatility.p.downside_vol)}</td>
                <td>{percent(d.annualized_volatility.b.downside_vol)}</td>
              </tr>
              <tr>
                <td>回撤区间起始日</td>
                <td>{d.max_drawback.p.start}</td>
                <td>{d.max_drawback.b.start}</td>
              </tr>
              <tr>
                <td>回撤区间结束日</td>
                <td>{d.max_drawback.p.end}</td>
                <td>{d.max_drawback.b.end}</td>
              </tr>
              <tr>
                <td>最大回撤</td>
                <td>{percent(d.max_drawback.p.drawback)}</td>
                <td>{percent(d.max_drawback.b.drawback)}</td>
              </tr>
              <tr>
                <td>上行捕获率</td>
                <td>{percent(d.ucr.p)}</td>
                <td/>
              </tr>
              <tr>
                <td>下行捕获率</td>
                <td>{percent(d.dcr.p)}</td>
                <td/>
              </tr>
              <tr>
                <td rowSpan={3}>综合评价</td>
                <td>夏普比</td>
                <td>{d.sharpe_ratio.p}</td>
                <td>{d.sharpe_ratio.b}</td>
              </tr>
              <tr>
                <td>卡玛比</td>
                <td>{d.calmar_ratio.p}</td>
                <td>{d.calmar_ratio.b}</td>
              </tr>
              <tr>
                <td>索提诺比</td>
                <td>{d.sortino_ratio.p}</td>
                <td>{d.sortino_ratio.b}</td>
              </tr>
              <tr>
                <td rowSpan={2}>在险价值</td>
                <td>VaR</td>
                <td>{percent(d.var.p)}</td>
                <td>{percent(d.var.b)}</td>
              </tr>
              <tr>
                <td>cVaR</td>
                <td>{percent(d.cvar.p)}</td>
                <td>{percent(d.cvar.b)}</td>
              </tr>
              </tbody>
            </table>
          </div>
    );
  }
}

class PerformanceChart extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state = {
    date: this.context.date,
    profitType: 1,
  }

  ref: React.RefObject<any> = React.createRef()
  ref2: React.RefObject<any> = React.createRef()
  ref3: React.RefObject<any> = React.createRef()

  showChart = (data: contributeType, ref: React.RefObject<any>, type: string) =>{
    const chart: any = echarts.init(ref.current, 'dark');
    const options: any = {
      backgroundColor: '#2c343c',
      tooltip: {
        trigger: 'item',
      },
      grid: {
        left: 40,
        top: 30,
        height: 185
      },
      textStyle: {
        fontSize: 12
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },
        data: ['\n总计', '\n权益', '\n固收', '\n另类', '货币\n及现金'],
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        name: `${type},单位：%`,
        nameLocation: 'end'
      },
      series: [{
        type: 'bar',
        data: [data.total_profit, data.equity, data.bond, data.alter, data.money],
        // itemStyle: {
        //   normal: {
        //     color: (x: any)=>{
        //       const colors = ['#c00000', '#E0B5B5', '#E0B5B5', '#E0B5B5', '#E0B5B5']
        //       return colors[x.dataIndex]
        //     },
        //   },
        // },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
        barWidth: '60%'
      }]
    }
    chart.setOption(options)
  }

  fetchData = () =>{
    let url
    if (this.state.profitType === 1){
      url = '/analysis/attribute/'
    }else{
      url = '/analysis/monthly/'
    }
    http.get(url, {
      params:{portCode: this.props.portCode, date: this.context.date.format('YYYY-MM-DD')}
    }).then(r=>{
      this.showChart(r.data, this.ref, '累计')
      this.showChart(r.week, this.ref2, 'WTD')
      this.showChart(r.month, this.ref3, 'MTD')
      this.setState({})
    }).catch(()=>{
      warning()
    })
  }

  onChangeProfitType = (e: any)=>{
    this.setState({profitType: e.target.value})
    this.fetchData()
  }

  componentDidUpdate(prevProps: any, prevState: any) {

    const prev = moment(prevState.date).format('YYYY-MM-DD')
    const now = moment(this.context.date).format('YYYY-MM-DD')
    if (prev !== now){
      this.fetchData()
      this.setState({date: this.context.date})
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  // shouldComponentUpdate(): boolean {
  //   return false;
  // }

  render() {
    const { profitType } = this.state
    return (
      <>
        <div className={style.performance}>
          <Button className={style.button}>组合业绩贡献</Button>
          <Radio.Group onChange={this.onChangeProfitType} value={profitType}>
            <Radio value={1}>不含费用</Radio>
            <Radio value={2}>含费用</Radio>
          </Radio.Group>
          <div className={style.chart} ref={this.ref} />
          <div className={style.chart} ref={this.ref2} />
          <div className={style.chart} ref={this.ref3} />
        </div>
      </>
    );
  }
}



export default class Performance extends React.Component<any, any>{
  static contextType = AnalysisTabContext

  state = {
    portCode: this.props.portCode,
  }

  render() {
    return (
      <>
        <div className={style.analysisTabContent}>
          <Row>
            <Col span={12}>
              <PerformanceTable portCode={this.state.portCode} />
            </Col>
            <Col span={12}>
              <PerformanceChart portCode={this.state.portCode} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
