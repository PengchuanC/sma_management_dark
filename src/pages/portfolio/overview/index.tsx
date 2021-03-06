import React from 'react';
import {Row, Col, Card} from 'antd';
import styles from './overiew.less';
import {PortfolioContext} from '@/utils/localstorage';
import NavChart from './nav_chart';
import AllocateChart, {AvgAllocate} from './allocate_chart';
import ChangeMonitorChart from './change_monitor';
import http from '@/utils/http'
import AvgPosition from './avg_postion';
import ValueHistory from './value_history';
import Cache from "@/utils/localstorage";
import {PageContainer} from '@ant-design/pro-layout';
import AllocateHistory from "@/pages/portfolio/overview/allocate_history";


export default class Overview extends React.Component<any, any> {

  state: { question: questionType } = {
    question: {}
  }

  static contextType = PortfolioContext

  // private routes: any;

  componentDidMount() {
    // const portName = localStorage.getItem('portName')
    const portCode = Cache.getDefaultPortcode()
    http.get('/overview/questionnairy/', {
      params: {portCode}
    }).then(r => {
      this.setState({question: r.data})
    })
  }

  render() {
    const portcode = Cache.getDefaultPortcode()
    const portName = localStorage.getItem('portName') || ''
    const q = this.state.question
    return (
      <PageContainer title={portName}>
        <div className={styles.contentArea}>
          <Row>
            <Col span={14}>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>穿透资产配置</div>
                </Card>
                <AllocateChart portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>资产配置变化</div>
                </Card>
                <AllocateHistory portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>盘中监控</div>
                </Card>
                <ChangeMonitorChart portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>估值记录</div>
                </Card>
                <ValueHistory portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>历史净值</div>
                </Card>
                <NavChart portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>基金平均仓位</div>
                </Card>
                <AvgPosition portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>区间平均配置</div>
                </Card>
                <AvgAllocate portCode={portcode}/>
              </div>
            </Col>
            <Col span={10} className={styles.rightArea}>
              <div >
                <div className={styles.tableTitle}>客户测评主要信息</div>
                <p className={styles.tdHeader}>风险等级: {q?.risk}</p>
                <p className={styles.tdHeader}>投资期限: {q?.maturity}</p>
                <p className={styles.tdHeader}>目标收益: {q?.arr}</p>
                <p className={styles.tdHeader}>目标风险: {q?.volatility}</p>
                <p className={styles.tdHeader}>流动性要求: {q?.fluidity}</p>
                {q?.age !== 0 ? (<p className={styles.tdHeader}>年龄: {q?.age}</p>) : <></>}
                <p className={styles.tdHeader}>投资经验: {q?.experience}</p>
                <div className={styles.tableTitle}>特殊需求</div>
                <p className={styles.tdHeader}>近期大额资金支出计划: {q?.plan}</p>
                <p className={styles.tdHeader}>回撤容忍度: {q?.tolerance}</p>
                <p className={styles.tdHeader}>另类资产限制: {q?.alter_limit}</p>
                <p className={styles.tdHeader}>跨境投资限制: {q?.cross_border_limit}</p>
              </div>
            </Col>
          </Row>
        </div>
      </PageContainer>
    )
  }
}
