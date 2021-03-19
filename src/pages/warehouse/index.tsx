import React from 'react';
import type { dropdownType } from '@/utils/dropdown';
import CustomDropdown from '@/utils/dropdown';
import styles from './warehouse.less';
import Calculator from './calculator';
import Complex from './complex';
import {PageContainer} from "@ant-design/pro-layout";

const dropdownItems: dropdownType[] = [
  { id: 0, name: '费用计算', comp: <Calculator /> },
  { id: 1, name: '模拟投资', comp: <Complex /> },
];

export default class WareHouse extends React.Component<any, any> {
  render() {
    return (
      <>
        <PageContainer>
          <div className={styles.contentArea}>
            <CustomDropdown items={dropdownItems} />
          </div>
        </PageContainer>
      </>
    );
  }
}
