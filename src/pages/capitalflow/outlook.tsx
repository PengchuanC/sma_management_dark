import React from "react";

import http from '@/utils/http';
import styles from './capitalflow.less';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import {history} from "umi";

export default class CFOutlook extends React.Component<any, any>{
  state = {
    first: []
  }

  fetchFirst = ()=>{
    http.get('/capital/outlook/').then((r: any) =>{
      this.setState({first: r})
    })
  }

  judge = (value: number) => {
    if (value > 1) {
      return '超买'
    }
    if (value < -1) {
      return '超卖'
    }
    return '正常'
  }

  judgeColor = (value: number) => {
    if (value > 1) {
      return styles.red
    }
    if (value < -1) {
      return styles.yellow
    }
    return styles.normal
  }

  onClickSecond = (secucode: string, secuabbr: string) =>{
    history.push({pathname:'/capital/second', query: {secucode, secuabbr}})
  }

  onClickChart = (secucode: string, secuabbr: string) =>{
    history.push({pathname:'/capital/chart', query: {secucode, secuabbr}})
  }

  componentDidMount() {
    this.fetchFirst()
  }

  render() {
    return (
      <>
        <div className={styles.outlook}>
          {this.state.first.map((x: any) => {
            return <div className={styles.box}>
              <h4>{x.secuabbr}</h4>
              <div className={styles.row}>
                <div>{this.judge(x.rank)}</div>
                <div className={this.judgeColor(x.rank)}>{x.rank.toFixed(2)}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.date}>{x.date}</div>
                <div className={styles.icons}>
                  <AppstoreOutlined onClick={()=>this.onClickSecond(x.secucode, x.secuabbr)} className={styles.icon}/>
                  <BarChartOutlined onClick={()=>this.onClickChart(x.secucode, x.secuabbr)} className={styles.icon}/>
                </div>
              </div>
            </div>
          })}
        </div>
      </>
    );
  }
}
