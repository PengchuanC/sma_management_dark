/**
 * title: 组合概览
 */

import React from 'react';
import styles from './list.less';
import { Row, Col } from 'antd';
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
  };

  fetchData() {
    api.get('/basic/all/').then(r => {
      const {sma_stat} = r
      this.setState({ num: sma_stat.num, total: sma_stat.total, avg: sma_stat.avg});
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
            <CustomDropdown items={items} />
          </div>
        </div>
      </PageContainer>
    );
  }
}
