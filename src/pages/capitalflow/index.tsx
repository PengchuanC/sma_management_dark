import React from 'react';
import styles from './capitalflow.less';
import {PageContainer} from "@ant-design/pro-layout";
import CFOutlook from "@/pages/capitalflow/outlook";

export default class CapitalFlow extends React.Component<any, any> {
  render() {
    return (
        <PageContainer title={false}>
          <div className={styles.contentArea}>
            <CFOutlook />
          </div>
        </PageContainer>
    );
  }
}
