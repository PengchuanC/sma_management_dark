import React from "react";
import Cache from "@/utils/localstorage";
import http from "@/utils/http";
import styles from "@/pages/portfolio/overview/overiew.less";


export default class Questionnaire extends React.Component<any, any> {

  state: {question: questionType} = {
    question: {}
  }

  fetchData = () => {
    const portCode = Cache.getDefaultPortcode()
    http.get('/overview/questionnairy/', {
      params: {portCode}
    }).then(r => {
      this.setState({question: r.data})
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const q = this.state.question
    return (
      <>
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
      </>
    )
  }
}
