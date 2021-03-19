import React from 'react';
import type { dropdownType } from '@/utils/dropdown';
import CustomDropdown from '@/utils/dropdown';
import styles from './capitalflow.less';
import Industry from '@/pages/capitalflow/industry';
import {PageContainer} from "@ant-design/pro-layout";

const dropdownItems: dropdownType[] = [
  { id: 0, name: '行业流向', comp: <Industry/>},
  { id: 1, name: '整体概览', comp: <div>概览</div> },
];

export default class CapitalFlow extends React.Component<any, any> {
  render() {
    return (
        <PageContainer title={false}>
          <div className={styles.contentArea}>
            <CustomDropdown items={dropdownItems} />
          </div>
        </PageContainer>
    );
  }
}
