import React from 'react';
import type { dropdownType } from '@/utils/dropdown';
import CustomDropdown from '@/utils/dropdown';
import styles from './analysis.less'
import HoldingFund from './holdingfund';
import HoldingStock from './holdingstock';
import HoldingYX from "@/pages/portfolio/analysis/holdingyx";
import HoldingNOI from "@/pages/portfolio/analysis/holdingnoi";
import HoldingETF from "@/pages/portfolio/analysis/holdingetf";


export default class Holding extends React.Component<any, any> {

  // 下拉菜单
  items: dropdownType[] = [
    {id: 0, name: '持基分析', comp: <HoldingFund portCode={this.props.portCode} />},
    {id: 1, name: '持股分析', comp: <HoldingStock portCode={this.props.portCode} />},
    {id: 2, name: '申赎渠道', comp: <HoldingYX portCode={this.props.portCode} />},
    {id: 3, name: '资产分类', comp: <HoldingNOI portCode={this.props.portCode} />},
    {id: 4, name: 'ETF表现', comp: <HoldingETF portCode={this.props.portCode} />},
  ]

  render() {
    return (
      <div className={styles.holding}>
        <div className={styles.holdingDropdown}>
          <CustomDropdown items={this.items} className={styles.holdingDropdown} />
        </div>
      </div>
    );
  }
}
