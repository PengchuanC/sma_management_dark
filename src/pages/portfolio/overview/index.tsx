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
import Questionnaire from "@/pages/portfolio/overview/questionnaire";


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
              <Questionnaire />
            </Col>
          </Row>
        </div>
      </PageContainer>
    )
  }
}
