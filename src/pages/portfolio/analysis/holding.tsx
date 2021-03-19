import React from 'react';
import type { dropdownType } from '@/utils/dropdown';
import CustomDropdown from '@/utils/dropdown';
import styles from './analysis.less'
import HoldingFund from './holdingfund';
import HoldingStock from './holdingstock';


export default class Holding extends React.Component<any, any> {

  // 下拉菜单
  items: dropdownType[] = [
    {id: 0, name: '持股分析', comp: <HoldingStock portCode={this.props.portCode} />},
    {id: 1, name: '持基分析', comp: <HoldingFund portCode={this.props.portCode} />},
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
