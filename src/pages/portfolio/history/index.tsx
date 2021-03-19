// eslint-disable-next-line max-classes-per-file
import React from 'react'
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './history.less';
import { Row, Col, Card, Statistic } from 'antd';
import type { dropdownType } from '@/utils/dropdown';
import CustomDropdown from '@/utils/dropdown';
import api from '@/utils/http';
import HistoryTable from './table';
import Cache from "@/utils/localstorage";
import {PageContainer} from "@ant-design/pro-layout";


const items: dropdownType[] = [
  // comp需要在子组件定制并引入到此处
  { id: 0, name: '交易明细', comp: <HistoryTable /> },
  // { id: 1, name: '调仓贡献', comp: <div>调仓贡献</div> },
]


class HistoryLayout extends React.Component<any, any>{
  state = {
    statistic: {
      total: {fee: 0, ratio: 0},
      last: {fee: 0, ratio: 0},
      date: '',
      turn_over: 0
    },
  }

  fetchData = ()=>{
    const portCode = Cache.getDefaultPortcode()
    api.get('/history/summary/', {params: {portCode, date: null}}).then(r=>{
      this.setState({statistic: r})
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <>
        <Row>
          <Col offset={1}>
            <Card className={styles.statisticCard}>
              <Statistic title="最新调仓日期" value={moment(this.state.statistic.date).format('M月D日')} suffix={moment(this.state.statistic.date).year()} />
            </Card>
          </Col>
          <Col offset={1}>
            <Card className={styles.statisticCard}>
              <Statistic title="历史调仓总费用" value={this.state.statistic.total.fee} precision={2} />
            </Card>
          </Col>
          <Col>
            <Card className={styles.statisticCard}>
              <Statistic title="占基金资产比例" value={this.state.statistic.total.ratio * 100} suffix={'%'} precision={2} />
            </Card>
          </Col>
          <Col offset={1}>
            <Card className={styles.statisticCard}>
              <Statistic title="最近一次调仓费用" value={this.state.statistic.last.fee} precision={2} />
            </Card>
          </Col>
          <Col>
            <Card className={styles.statisticCard}>
              <Statistic title="占基金资产比例" value={this.state.statistic.last.ratio * 10000} suffix={'‱'} precision={2} />
            </Card>
          </Col>
          <Col offset={1}>
            <Card className={styles.statisticCard}>
              <Statistic title="换手率" value={this.state.statistic.turn_over * 100} suffix={'%'} precision={2} />
            </Card>
          </Col>
        </Row>
        <CustomDropdown items={items} />
      </>
    );
  }
}



export default class Overview extends React.Component<any, any> {

  render() {
    const portcode = Cache.getDefaultPortcode()
    const portName = localStorage.getItem('portName') || ''
    return (
      <PageContainer title={portName}>
        <div className={styles.contentArea}>
          <HistoryLayout portCode={portcode} />
        </div>
      </PageContainer>
    )
  }
}
