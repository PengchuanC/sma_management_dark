import React from "react";
import { Row, Col, Table } from 'antd';
import style from './allocate.less';

import type { dropdownType } from './dropdown';
import BackTestDropdown from './dropdown';
import { formatNav, formatPercent } from '@/utils/util';
import http from '@/utils/http';
import { BacktestContext } from '@/utils/localstorage';
import moment from 'moment';
import Weight from '@/pages/allocate/weight';
import * as echarts from 'echarts';

const windowHeight = `${window.innerHeight - 64 - 30 - 46 - 40  }px`;

const portfolioName: portfolioNameType = {
  cash: '现金型',
  equal: '平衡型',
  equity: '权益型',
  fix: '固收型',
  increase: '成长型',
  zcf: '总财富',
  zz800: '中证800',
};

export const columns2: any = [
  {
    title: '组合名称',
    dataIndex: 'index',
    key: 'index',
    align: 'left',
    width: 100,
  },
  {
    title: '累计收益',
    dataIndex: 'acc_return_yield',
    key: 'acc_return_yield',
    align: 'right',
    render: (text: any, r: backtestPerfType) =>
      formatPercent(r.acc_return_yield),
  },
  {
    title: '年化收益',
    dataIndex: 'annualized_return_yield',
    key: 'annualized_return_yield',
    align: 'right',
    render: (text: any, r: backtestPerfType) =>
      formatPercent(r.annualized_return_yield),
  },
  {
    title: '年化波动',
    dataIndex: 'vol',
    key: 'vol',
    align: 'right',
    render: (text: any, r: backtestPerfType) => formatPercent(r.vol),
  },
  {
    title: '下行波动',
    dataIndex: 'downside_vol',
    key: 'downside_vol',
    align: 'right',
    render: (text: any, r: backtestPerfType) => formatPercent(r.downside_vol),
  },
  {
    title: '最大回撤',
    dataIndex: 'max_drawback',
    key: 'max_drawback',
    align: 'right',
    render: (text: any, r: backtestPerfType) => formatPercent(r.max_drawback),
  },
  {
    title: '夏普',
    dataIndex: 'sharpe_ratio',
    key: 'sharpe_ratio',
    align: 'right',
    render: (text: any, r: backtestPerfType) => r.sharpe_ratio.toFixed(2),
  },
  {
    title: '索提诺',
    dataIndex: 'sortino_ratio',
    key: 'sortino_ratio',
    align: 'right',
    render: (text: any, r: backtestPerfType) => r.sortino_ratio.toFixed(2),
  },
  {
    title: '卡玛',
    dataIndex: 'calmar_ratio',
    key: 'calmar_ratio',
    align: 'right',
    render: (text: any, r: backtestPerfType) => r.calmar_ratio.toFixed(2),
  },
  {
    title: 'Var',
    dataIndex: 'var',
    key: 'var',
    align: 'right',
    render: (text: any, r: backtestPerfType) => formatPercent(r.var),
  },
  {
    title: 'cVar',
    dataIndex: 'cvar',
    key: 'cvar',
    align: 'right',
    render: (text: any, r: backtestPerfType) => formatPercent(r.cvar),
  },
];

class BaseBackTestResult extends React.Component<any, any> {
  static contextType = BacktestContext;

  state = {
    nav: [],
    perf: [],
    date: moment(new Date()),
    loading: true,
  };

  ref: React.RefObject<any> = React.createRef();

  public fetchData = () => {
    this.setState({ loading: true, date: this.context.date });
    http
      .get('/backtest/', {
        params: { date: this.context.date.format('YYYY-MM-DD') },
      })
      .then(r => {
        this.showChart(r.nav);
        this.setState({
          nav: r.nav,
          perf: r.perf,
          loading: false,
        });
      });
  };

  showChart = (data: backtestType[]) => {
    if (!data) {
      return;
    }
    const chart: any = echarts.init(this.ref.current, 'dark');
    const option = {
      backgroundColor: '#2c343c',
      grid: {},
      legend: {
        show: true,
        icon: 'line',
        top: 10,
      },
      xAxis: {
        type: 'category',
        data: data.map(x => x.date),
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
        'cash',
        'fix',
        'equal',
        'increase',
        'equity',
        'zz800',
        'zcf',
      ].map(x => {
        return {
          name: portfolioName[x],
          data: data.map(y => y[x]),
          type: 'line',
        };
      }),
    };
    chart.setOption(option);
    window.addEventListener('resize', () => {
      chart.resize();
    });
    this.setState({});
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.state.date.date() !== this.context.date.date()) {
      this.fetchData();
    }
  }

  doRender = () => {
    const columns: any = [
      // {
      //   title: '序号',
      //   dataIndex: 'key',
      //   key: 'key',
      //   align: 'center',
      // },
      {
        title: '交易日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        sorter: (a: backtestType, b: backtestType) => {
          if (a.date > b.date) return 1;
          return -1;
        },
      },
      {
        title: '现金型',
        dataIndex: 'cash',
        key: 'cash',
        align: 'center',
        render: (text: any, r: backtestType) => formatNav(r.cash),
      },
      {
        title: '固收型',
        dataIndex: 'fix',
        key: 'fix',
        align: 'center',
        render: (text: any, r: backtestType) => formatNav(r.fix),
      },
      {
        title: '平衡型',
        dataIndex: 'equal',
        key: 'equal',
        align: 'center',
        render: (text: any, r: backtestType) => formatNav(r.equal),
      },
      {
        title: '成长型',
        dataIndex: 'increase',
        key: 'increase',
        align: 'center',
        render: (text: any, r: backtestType) => formatNav(r.increase),
      },
      {
        title: '权益型',
        dataIndex: 'equity',
        key: 'equity',
        align: 'center',
        render: (text: any, r: backtestType) => formatNav(r.equity),
      },
      {
        title: '中证800',
        dataIndex: 'zz800',
        key: 'zz800',
        align: 'center',
        render: (text: any, r: backtestType) => formatNav(r.zz800),
      },
      {
        title: '中债总财富',
        dataIndex: 'zcf',
        key: 'zcf',
        align: 'center',
        render: (text: any, r: backtestType) => formatNav(r.zcf),
      },
    ];
    return (
      <Row>
        <Col span={11} className={style.backtest}>
          <Table
            className={style.backtestTable}
            style={{ maxHeight: windowHeight }}
            bordered
            sticky
            size="small"
            columns={columns}
            dataSource={this.state.nav}
            pagination={{
              defaultPageSize: 15,
              pageSizeOptions: ['10', '25', '50', '100', '200'],
            }}
          />
        </Col>
        <Col span={13}>
          <Table
            bordered
            sticky
            size="small"
            columns={columns2}
            dataSource={this.state.perf}
            pagination={false}
          />
          <div
            className={style.backtestChart}
            ref={this.ref}
            style={{ height: '350px' }}
          />
        </Col>
      </Row>
    );
  };
}

class BackTestResult extends BaseBackTestResult {
  render() {
    return this.doRender();
  }
}

class IndexBackTestResult extends BaseBackTestResult {
  fetchData = () => {
    this.setState({ date: this.context.date });
    http
      .get('/backtest/index/', {
        params: { date: this.context.date.format('YYYY-MM-DD') },
        timeout: 100000,
      })
      .then(r => {
        this.showChart(r.nav);
        this.setState({ nav: r.nav, perf: r.perf, date: this.context.date });
      });
  };

  render() {
    return this.doRender();
  }
}


export default class BackTest extends React.Component<any, any> {
  setDate = (d: moment.Moment) => {
    this.setState({
      date: d,
    });
  };

  state = {
    date: moment(new Date()),
    setDate: this.setDate,
  };


  items: dropdownType[] = [
    { id: 0, name: '回测结果', comp: <BackTestResult /> },
    { id: 1, name: '指数权重', comp: <Weight /> },
    { id: 2, name: '指数回测', comp: <IndexBackTestResult /> },
  ];

  render() {
    return (
      <BacktestContext.Provider value={this.state}>
        <div className={style.layoutContent}>
          <div className={style.contentArea}>
            <BackTestDropdown items={this.items} />
          </div>
        </div>
      </BacktestContext.Provider>
    );
  }
}
