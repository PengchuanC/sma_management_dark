import React from "react";
import { PageContainer } from "@ant-design/pro-layout";
import {Button} from "antd";
import { history } from "umi";
import CtaHolding from "@/pages/portfolio/cta/holding";
import styles from './cta.less';


export default class CtaTradingInfo extends React.Component<any, any> {

  state = {
    name: sessionStorage.getItem('cta_name'),
    code: sessionStorage.getItem('cta_code'),
    radio: 1,
  }

  render() {
    return (
      <>
        <PageContainer title={this.state.name} onBack={()=> history.goBack()}>
          <div className={styles.ctaInfo}>
            <Button href={"/cta/funds"} target='_blank' className={styles.radioGroup}>跳转后台</Button>
            <CtaHolding port_code={this.state.code} />
          </div>
        </PageContainer>
      </>
    );
  }
}
