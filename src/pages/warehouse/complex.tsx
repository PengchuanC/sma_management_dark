// eslint-disable-next-line max-classes-per-file
import React from 'react';
import {Button, Col, Input, message, Row, Select, Table, Tag,} from 'antd';
import http, {basicUrl} from '@/utils/http';
import moment from 'moment';
import styles from './warehouse.less';
import {numeralNum} from '@/utils/util';

const { Option } = Select;


// 调仓结果表格展示
class ChangeResult extends React.Component<any, any> {
  render() {
    const columns: Object[] | [] = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '基金名称',
        dataIndex: 'secuname',
        key: 'secuname',
        align: 'center',
      },
      {
        title: '交易方向',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
      },
      {
        title: '交易数量',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (text: any, record: changeResultType) =>
          numeralNum(record.amount),
      },
      {
        title: '交易费用',
        dataIndex: 'fee',
        key: 'fee',
        align: 'right',
        render: (text: any, record: changeResultType) => numeralNum(record.fee),
      },
    ];
    return (
      <Table
        size={'small'}
        bordered
        columns={columns}
        pagination={false}
        style={{ marginTop: '10px' }}
        dataSource={this.props.data}
      />
    );
  }
}

function sum(arr: number[]) {
  let s = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = arr.length - 1; i >= 0; i--) {
    s += arr[i];
  }
  return s;
}


export default class Complex extends React.Component<any, any> {
  ref = React.createRef();

  state = {
    portfolio: '',
    ports: [],
    date: moment().format('ll'),
    holding: [],
    sell: [],
    sell2: [],
    buy: { secuname: '', secucode: '', ratio: 0 },
    buy2: [],
    rise: 0,
    loading: false,
    showTable: false,
    result: [],
    need_yx: false
  };

  // 获取全部组合
  fetchPortfolio = () => {
    http.get('/warehouse/portfolio/').then(r => {
      const {data} = r;
      this.setState({ ports: data });
    });
  };

  // 选择组合
  selectPortfolio = (e: any) => {
    http
      .get('/warehouse/complex/holding/', { params: { portCode: e } })
      .then(r => {
        this.setState({ portfolio: e, holding: r.data, need_yx: r.yx  });
      });
  };

  // 选择基金
  onSelectFund = (i: any) => {
    const {sell} = this.state;
    const {holding} = this.state;
    const t: any = holding[i];
    holding.splice(i, 1);
    const toAdd: any = {
      secucode: t.secucode,
      secuname: t.secuname,
      ratio: t.ratio,
      target: 0,
    };
    if (this.state.need_yx) {
      toAdd.unavailable = t.unavailable
      toAdd.target = (t.unavailable * 100).toFixed(4)
    }

    // @ts-ignore
    sell.push(toAdd);
    this.setState({ sell, holding });
  };

  // 第二种调仓方式选择转入的基金
  onSelectFund2 = (i: any) => {
    const buy: any = this.state.buy2;
    const {holding} = this.state;
    const t: any = holding[i];
    holding.splice(i, 1);
    const toAdd: any = {
      secucode: t.secucode,
      secuname: t.secuname,
      ratio: t.ratio,
      target: 0,
    };
    buy.push(toAdd);
    this.setState({ buy2: buy, holding });
  };

  // 第二种调仓方式选择转出的基金
  onSelectFundSell = (i: any) => {
    const sell: any = this.state.sell2;
    const {holding} = this.state;
    const t: any = holding[i];
    holding.splice(i, 1);
    const toAdd: any = {
      secucode: t.secucode,
      secuname: t.secuname,
      ratio: t.ratio,
      target: 0,
    };
    if(this.state.need_yx){
      toAdd.available = t.ratio - t.unavailable
    }
    sell.push(toAdd);
    this.setState({ sell2: sell, holding });
  };

  // 检查输入转换比例是否超限
  check = (e: any, i: any) => {
    const {sell} = this.state;
    let target = e.target.value;
    const {ratio} = sell[i];
    if (target > ratio * 100) {
      message.error('调整后的仓位超过了当前持仓，请重新设置');
      target = 0;
    }
    // @ts-ignore
    sell[i].target = target;
    this.setState({ sell });
  };

  // 检查输入转换比例是否超限
  check2 = (e: any) => {
    let target = Number(e.target.value);
    // @ts-ignore
    const max: number = this.state.need_yx? sum(this.state.sell2.map(x => Number(x.available))): sum(this.state.sell2.map(x => Number(x.ratio)));
    if (target / 100 > max) {
      message.warn('调整后的仓位超过了当前持仓，已自动更新为最大可用持仓').then(() => {});
      target = max * 100;
    }
    this.setState({ rise: Number(target.toFixed(2)) });
  };

  onFinish = () => {
    if (this.state.sell.length === 0 || !this.state.buy.secucode) {
      message.error('转入转出基金设置不完整').then(() => {});
      return;
    }
    this.setState({ loading: true });
    http
      .post('/warehouse/complex/', {
        data: {
          portCode: this.state.portfolio,
          src: this.state.sell,
          dst: this.state.buy.secucode,
        },
      })
      .then(r => {
        this.setState({ loading: false, result: r, showTable: true});
      })
      .catch(() => this.setState({ loading: false }));
  };

  onFinish2 = () => {
    if (this.state.sell2.length === 0 || this.state.buy2.length === 0) {
      message.error('转入转出基金设置不完整');
      return;
    }
    this.setState({ loading: true });
    http
      .post('/warehouse/complex/bulk/', {
        data: {
          portCode: this.state.portfolio,
          src: this.state.sell2,
          dst: this.state.buy2,
          rise: Number(this.state.rise),
        },
      })
      .then(r => {
        this.setState({ loading: false, result: r, showTable: true });
      })
      .catch(() => this.setState({ loading: false }));
  };

  onDownload = () => {
    window.location.href = `${basicUrl  }/warehouse/complex/download/`;
  };

  componentDidMount() {
    this.fetchPortfolio();
  }

  render() {
    const spanNum = this.state.need_yx? 6: 8
    return (
      <>
        <Select
          placeholder="请选择组合"
          style={{ width: '200px' }}
          onChange={this.selectPortfolio}
        >
          {this.state.ports.map(
            (e: { id: number; port_code: string; port_name: string }) => {
              return (
                <Option key={e.id} value={e.port_code}>
                  {e.port_name}
                </Option>
              );
            },
          )}
        </Select>
        <Button className={styles.downloadButton} onClick={this.onDownload}>
          下载
        </Button>
        <Row className={styles.complex}>
          <Col span={12} className={styles.emulate}>
            <Tag color="#f50" className={styles.tag}>
              待转出基金
            </Tag>
            <Select
              placeholder={'请选择待转出基金'}
              onChange={i => {
                this.onSelectFund(i);
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.sell.map((e: any, i: number) => {
              return (
                <Row key={i} className={styles.selectedFundWrapper}>
                  <Col span={spanNum}>
                    <Input
                      value={e.secuname}
                      disabled={true}
                      addonBefore="基金代码"
                    />
                  </Col>
                  <Col span={spanNum}>
                    <Input
                      value={(e.ratio * 100).toFixed(4)}
                      disabled={true}
                      addonBefore="当前持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                    />
                  </Col>
                  {this.state.need_yx? <Col span={spanNum}>
                    <Input
                      value={(e.unavailable * 100).toFixed(4)}
                      disabled={true}
                      addonBefore="最低仓位"
                      addonAfter="%"
                      className={styles.selectedFund}
                    />
                  </Col>: <></>}
                  <Col span={spanNum}>
                    <Input
                      value={e.target}
                      addonBefore="目标持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                      onChange={event => this.check(event, i)}
                    />
                  </Col>
                </Row>
              );
            })}
            <Tag color="#f50" className={styles.tag}>
              待转入基金
            </Tag>
            <Select
              placeholder={'请选择待转入基金'}
              onChange={i => {
                this.setState({ buy: this.state.holding[Number(i)] });
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.buy.secuname ? (
              <Row className={styles.selectedFundWrapper}>
                <Col span={12}>
                  <Input
                    value={this.state.buy.secuname}
                    disabled={true}
                    addonBefore="基金代码"
                  />
                </Col>
                <Col span={12}>
                  <Input
                    value={(this.state.buy.ratio * 100).toFixed(4)}
                    disabled={true}
                    addonBefore="当前持仓"
                    addonAfter="%"
                    className={styles.selectedFund}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}
            <div style={{ height: '42px' }} />
            <Button
              loading={this.state.loading}
              type="primary"
              htmlType="submit"
              onClick={this.onFinish}
              className={styles.submitButton}
            >
              提交
            </Button>
          </Col>

          {/* 第二种调仓方式 */}
          <Col span={12} className={styles.emulate}>
            <Tag color="#f50" className={styles.tag}>
              待转入基金
            </Tag>
            <Select
              placeholder={'请选择待转入基金'}
              onChange={i => {
                this.onSelectFund2(i);
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.buy2.map((e: any, i: number) => {
              return (
                <Row key={i} className={styles.selectedFundWrapper}>
                  <Col span={12}>
                    <Input
                      value={e.secuname}
                      disabled={true}
                      addonBefore="基金代码"
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      value={(e.ratio * 100).toFixed(4)}
                      disabled={true}
                      addonBefore="当前持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                    />
                  </Col>
                </Row>
              );
            })}
            <Tag color="#f50" className={styles.tag}>
              待转出基金
            </Tag>
            <Select
              placeholder={'请选择待转出基金'}
              onChange={i => {
                this.onSelectFundSell(i);
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.sell2.map((e: any, i: number) => {
              const spanWidth = this.state.need_yx? 8: 12
              return (
                <Row key={i} className={styles.selectedFundWrapper}>
                  <Col span={spanWidth}>
                    <Input
                      value={e.secuname}
                      disabled={true}
                      addonBefore="基金代码"
                    />
                  </Col>
                  <Col span={spanWidth}>
                    <Input
                      value={(e.ratio * 100).toFixed(4)}
                      disabled={true}
                      addonBefore="当前持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                    />
                  </Col>
                  {
                    this.state.need_yx? <Col span={spanWidth}>
                    <Input
                    value={(e.available * 100).toFixed(4)}
                    disabled={true}
                    addonBefore="可用持仓"
                    addonAfter="%"
                    className={styles.selectedFund}
                    />
                    </Col>: <></>
                  }
                </Row>
              );
            })}
            <Input
              addonBefore="仓位提升"
              addonAfter="%"
              value={this.state.rise}
              className={styles.riseTo}
              onChange={(e)=>{this.setState({rise: e.target.value})}}
              onPressEnter={this.check2}
            />
            <Button
              loading={this.state.loading}
              type="primary"
              htmlType="submit"
              onClick={this.onFinish2}
              className={styles.submitButton}
            >
              提交
            </Button>
          </Col>
        </Row>
        {this.state.showTable ? (
          <ChangeResult
            data={this.state.result}
            className={styles.resultTable}
          />
        ) : (
          <div />
        )}
      </>
    );
  }
}
