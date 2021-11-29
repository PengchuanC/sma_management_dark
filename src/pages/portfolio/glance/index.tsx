/**
 * title: 组合概览
 */

import React from 'react';
import styles from './list.less';
import { Statistic, Row, Col, Card } from 'antd';
import PortfolioTable from './table';
import api from '@/utils/http';
import type { dropdownType } from '@/utils/dropdown';
import CustomDropdown from '@/utils/dropdown';
import CapitalAnalyze from '@/pages/portfolio/glance/capital';
import Announcement from '@/pages/portfolio/glance/announcement';
import AccountAnalysis from '@/pages/portfolio/glance/account';
import PurchaseAndRansom from '@/pages/portfolio/glance/pr';
import { PageContainer } from '@ant-design/pro-layout';
import CtaHomePage from "@/pages/portfolio/glance/cta";

function PortfolioInfo() {
  return (
    <Row>
      <Col span={19}>
        <div>
          <PortfolioTable />
          <br />
          <CtaHomePage className={styles.cta} />
        </div>
      </Col>
      <Col span={5}>
        <Announcement />
      </Col>
    </Row>
  );
}

const items: dropdownType[] = [
  { id: 0, name: '组合信息', comp: <PortfolioInfo /> },
  { id: 1, name: '资金分析', comp: <CapitalAnalyze /> },
  { id: 2, name: '账户分析', comp: <AccountAnalysis /> },
  { id: 3, name: '申赎分析', comp: <PurchaseAndRansom /> },
];

export default class Glance extends React.Component<any, any> {

  state = {
    num: 0,
    total: 0,
    avg: 0,
    last: '',
  };

  fetchData() {
    api.get('/basic/all/').then(r => {
      this.setState({ num: r.num, total: r.total, avg: r.avg, last: r.last });
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <PageContainer title={false}>
        <div className={styles.layoutContent}>
          <div className={styles.contentArea}>
            <Row>
              <Col offset={1} span={4}>
                <Card className={styles.statisticCard}>
                  <Statistic title="账户总数" value={this.state.num} />
                </Card>
              </Col>
              <Col span={4}>
                <Card className={styles.statisticCard}>
                  <Statistic
                    title="管理资产"
                    value={this.state.total}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card className={styles.statisticCard}>
                  <Statistic
                    title="户均资产"
                    value={this.state.avg}
                    precision={2}
                  />
                </Card>
              </Col>
            </Row>
            <CustomDropdown items={items} />
          </div>
        </div>
      </PageContainer>
    );
  }
}
