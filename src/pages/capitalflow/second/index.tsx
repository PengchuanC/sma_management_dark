import { PageContainer } from "@ant-design/pro-layout";
import { history } from "umi";
import http from "@/utils/http";
import styles from "@/pages/capitalflow/capitalflow.less";
import { BarChartOutlined} from "@ant-design/icons";
import CFOutlook from "@/pages/capitalflow/outlook";


export default class SecondIndustry extends CFOutlook {

  state: {
    params: any,
    first: []
  } = {
    params: history.location.query,
    first: []
  }

  fetchSecond = ()=>{
    http.post('/capital/outlook/', {data: {secucode: this.state.params.secucode}}).then((r: any) =>{
      this.setState({first: r})
    })
  }

  componentDidMount() {
    this.fetchSecond()
  }

  render() {
    return (
      <PageContainer title={this.state.params.secuabbr} onBack={()=> history.goBack()}>
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
                  <BarChartOutlined onClick={()=>this.onClickChart(x.secucode, x.secuabbr)} className={styles.icon}/>
                </div>
              </div>
            </div>
          })}
        </div>
      </PageContainer>
    );
  }
}
