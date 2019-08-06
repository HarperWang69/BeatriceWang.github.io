import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import { Card,Form,Icon,Row,Col } from 'antd';
import styles from './styles.less'
import moment from 'moment';
// 引入 ECharts 主模块(这里路径引入错误参考上文文档描述)
import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react'; //不要删除此行
import  'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import * as routerRedux from 'react-router-redux';

const FormItem = Form.Item;
const color= {
  ele: ['#addef7', '#38a4dd'],
  water: ['#cdedea', '#6dc7be'],
  q: ['#e7e0f4','#b39ddb'],
  ord: ['#38a4dd', '#5ec7bd','#ffc400'],
};

@connect(({ option,home }) => ({ option,home }))
// @Form.create()
class Home extends PureComponent {

  state = {
    buildId:'',
    month:'',
    energyAnalysis: {
      coulometry:{
        comparedSameMonth:[],
        monthOnMonth:[],
        annualBasis:[]
      },
      gasAnalysis:{
        comparedSameMonth:[],
        monthOnMonth:[],
        annualBasis:[]
      },
      waterAnalysis:{
        comparedSameMonth:[],
        monthOnMonth:[],
        annualBasis:[]
      },
    },
    statistics: {
      dayWork: 0,
      undispatch: 0,
      unaccept: 0,
      disposal: 0,
      hang: 0,
      finish: 0
    },
    MyMonth:'',
    orderDatas:{},
  }

  componentDidMount() {
    this.initFetch()
  }

  // 初始化数据列表
  initFetch = () => {
    this.getTheMonth()
    this.getEnergyAnalysisData()
    this.initEchart()
    this.fetchOrderData()
    this.getOrderData()
  }

  getTheMonth = () =>{
    //获取上个月日期
    let date = new Date;
    let year = date.getFullYear();
    let month = date.getMonth();
    if (month == 0) {year = year - 1;month = 12;}
    this.state.month = month
  }

  initEchart =()=>{
    this.elecChart = echarts.init(document.getElementById('elecChart'));
    this.waterChart = echarts.init(document.getElementById('waterChart'));
    this.qChart = echarts.init(document.getElementById('qChart'));
    this.ordChart = echarts.init(document.getElementById('ordChart'));
  }
  getEnergyAnalysisData =() => {
    const { dispatch } = this.props
    dispatch({
      type: 'energyAnalysis/findEnergyData',
      payload: this.state.buildId,
      callback: response => {
        this.setState({
          energyAnalysis:response.data.energyAnalysis
        })
        this.setChartData(this.elecChart, response.data.energyAnalysis.coulometry, '电');
        this.setChartData(this.waterChart, response.data.energyAnalysis.waterAnalysis, '水');
        this.setChartData(this.qChart, response.data.energyAnalysis.gasAnalysis, '天然气');
      },
    });
  }

  //获得工单分析结果
  fetchOrderData =()=> {
    const { dispatch } = this.props
    dispatch({
      type: 'orderStatistics/fetchWorkOrder',
      payload: {
        parameter: 1,
        pageNum: 1,
        pageSize: 10,
        ticket: sessionStorage.getItem('ticket')
      }, callback: response => {
        this.setState({statistics:response.data.count})
      }
    })
  }
  //获得工单统计图数据
  getOrderData =()=>{
    let date = new Date();
    let currentMonth = date.getMonth();
    let nextMonth = ++currentMonth;
    let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    let oneDay = 1000 * 60 * 60 * 24;
    let beginMonth = new Date().getMonth()+1
    //获得本月第一天和最后一天的日期时间
    this.beginDate = new Date().getFullYear() + '-'+beginMonth+'-'+1+' 00:00:00'
    this.endDate = moment(new Date(nextMonthFirstDay - oneDay)).format('YYYY-MM-DD')+' 23:59:59'
    const { dispatch } = this.props
    dispatch({
      type: 'orderStatistics/fetchWorkCountByProjects',
      payload: {
        beginDate:this.beginDate,
        endDate:this.endDate
      }, callback: response => {
        this.setState({
          orderDatas:response.data
        })
        this.setOrderData(this.ordChart,response.data);
      }
    })
  }

  toWorkOrder =()=>{
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/workOrder/orderDispatch'));
  }
//配置工单统计图
  setOrderData =(echartObj, data)=> {
    echartObj.setOption({
      color: color.ord,
      grid: {
        left: 60,
        top: 50,
        right: 70,
        bottom: 50,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        }
      },
      legend: {
        left:'right',
        textStyle: {
          color: '#78909c'
        },
        data: [`故障工单`,`巡检工单`,`维保工单`]
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#78909c'
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          data: data.xAxis
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '工单数/个',
          position: 'left',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#78909c'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {show: true},
        },
      ],
      series: [
        {
          name: `故障工单`,
          type: 'bar',
          barWidth : 8,
          data: data.acciData || []
        },
        {
          name: `巡检工单`,
          type: 'bar',
          barWidth : 8,
          data: data.patrolData|| []
        },
        {
          name: `维保工单`,
          type: 'bar',
          barWidth : 8,
          data: data.mtData || []
        }
      ]
    });
  }

  setChartData =(echartObj,data,typeName)=> {
    echartObj.setOption({
      color: typeName === '电' ? color.ele : typeName === '水' ? color.water : color.q,
      grid: {
        left: 60,
        top: 50,
        right: 70,
        bottom: 50,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        }
      },
      legend: {
        textStyle: {
          color: '#78909c'
        },
        data:[`去年${typeName}用量`,`今年${typeName}用量`]
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#78909c'
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: typeName === '电' ? '电量(Kwh)' : typeName === '水' ? '水量(t)' : '天然气(m³)',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#78909c'
            }
          },
          splitLine: {show: true},
        },
      ],
      series: [
        {
          name:`去年${typeName}用量`,
          type:'bar',
          data: data.eachMonthPreYear || []
        },
        {
          name:`今年${typeName}用量`,
          type:'bar',
          data: data.eachMonthYear || []
        }]
    });
  }

  render(){
    return(
      <div>
        <Card>
          <Row className={styles.analysis}>
            <Col className={styles.statistics} style={{marginRight:'1%'}}>
              <span className={styles.headIcon}><Icon type="solution" style={{marginRight:'10px'}}/>工单状态</span>
              <Row style={{width:'100%',height:'20%'}}>
                <Col style={{textAlign:'center',float:'left',width:'25%'}}>
                  <div className={styles.fuck} style={{fontSize:'35px',cursor:'pointer'}} onClick={this.toWorkOrder}>{this.state.statistics.today}</div>
                  <div style={{fontSize:'20px'}}>今日工单(个)</div>
                </Col>
                <Col style={{textAlign:'center',float:'left',width:'25%'}}>
                  <div style={{fontSize:'35px',cursor:'pointer'}} onClick={this.toWorkOrder}>{this.state.statistics.undone}</div>
                  <div style={{fontSize:'20px'}}>所有未完成(个)</div>
                </Col>
                <Col style={{textAlign:'center',float:'left',width:'25%'}}>
                  <div style={{fontSize:'35px',cursor:'pointer'}} onClick={this.toWorkOrder}>{this.state.statistics.completed}</div>
                  <div style={{fontSize:'20px'}}>今日已完成(个)</div>
                </Col>
                <Col style={{textAlign:'center',float:'left',width:'25%'}}>
                  <div style={{fontSize:'35px',cursor:'pointer'}} onClick={this.toWorkOrder}>{this.state.statistics.attention}</div>
                  <div style={{fontSize:'20px'}}>今日关注(个)</div>
                </Col>
              </Row>
              <Row  style={{textAlign:'center',fontSize:'18px',fontWeight:'bold',marginTop:'10px',marginBottom:'10px'}}>本月工单统计</Row>
              <Row style={{width:'85%',height:'70%'}}>
                <div id="ordChart" style={{width:'100%',height:'270px'}}/>
              </Row>
            </Col>
            <Col className={styles.statistics}>
              <span className={styles.headIcon}><Icon type="bar-chart" style={{marginRight:'10px'}}/>电量统计</span>
              <Row style={{width:'100%',height:'20%'}}>
                <Col style={{textAlign:'center',width:'50%',float:'left'}}>
                  <div>
                    <span style={{fontSize:'35px'}}>{this.state.energyAnalysis.coulometry.monthlyEle || 0}</span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>同比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#FF7F50'}}>
                      {this.state.energyAnalysis.coulometry.comparedSameMonth[0] ? '+':'-'}
                      {this.state.energyAnalysis.coulometry.comparedSameMonth[1] || 0}
                    </span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>环比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#4AD089'}}>
                      {this.state.energyAnalysis.coulometry.monthOnMonth[0] ? '+':'-'}
                      {this.state.energyAnalysis.coulometry.monthOnMonth[1] || 0}
                    </span>
                  </div>
                  <div style={{fontSize:'20px'}}>{this.state.month}月用电量(kwh)</div>
                </Col>
                <Col style={{textAlign:'center',width:'50%',float:'left'}}>
                  <div>
                    <span style={{fontSize:'35px'}}>{this.state.energyAnalysis.coulometry.totalElecYear || 0}</span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>同比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#FF7F50'}}>
                      {this.state.energyAnalysis.coulometry.annualBasis[0] ? '+':'-'}
                      {this.state.energyAnalysis.coulometry.annualBasis[1] || 0}
                    </span>
                  </div>
                  <div style={{fontSize:'20px'}}>本年用电量(kwh)</div>
                </Col>
              </Row>
              <Row style={{textAlign:'center',fontSize:'18px',fontWeight:'bold',marginTop:'10px',marginBottom:'10px'}}>全年电量统计</Row>
              <Row style={{width:'85%',height:'70%'}}>
                <div id="elecChart" style={{width:'100%',height:'270px'}}/>
              </Row>
            </Col>
          </Row>
          <Row className={styles.analysis}>
            <Col className={styles.statistics} style={{marginRight:'1%'}}>
              <span className={styles.headIcon}><Icon type="bar-chart" style={{marginRight:'10px'}}/>水量统计</span>
              <Row style={{width:'100%',height:'20%'}}>
                <Col style={{textAlign:'center',width:'50%',float:'left'}}>
                  <div>
                    <span style={{fontSize:'35px'}}>{this.state.energyAnalysis.waterAnalysis.monthlyWater || 0}</span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>同比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#FF7F50'}}>
                      {this.state.energyAnalysis.waterAnalysis.comparedSameMonth[0] ? '+':'-'}
                      {this.state.energyAnalysis.waterAnalysis.comparedSameMonth[1] || 0}
                    </span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>环比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#4AD089'}}>
                      {this.state.energyAnalysis.waterAnalysis.monthOnMonth[0] ? '+':'-'}
                      {this.state.energyAnalysis.waterAnalysis.monthOnMonth[1] || 0}
                    </span>
                  </div>
                  <div style={{fontSize:'20px'}}>{this.state.month}月用水量(t)</div>
                </Col>
                <Col style={{textAlign:'center',width:'50%',float:'left'}}>
                  <div>
                    <span style={{fontSize:'35px'}}>{this.state.energyAnalysis.waterAnalysis.totalWaterYear || 0}</span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>同比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#FF7F50'}}>
                      {this.state.energyAnalysis.waterAnalysis.annualBasis[0] ? '+':'-'}
                      {this.state.energyAnalysis.waterAnalysis.annualBasis[1] || 0}
                    </span>
                  </div>
                  <div style={{fontSize:'20px'}}>本年用水量(t)</div>
                </Col>
              </Row>
              <Row style={{textAlign:'center',fontSize:'18px',fontWeight:'bold',marginTop:'10px',marginBottom:'10px'}}>全年水量统计</Row>
              <Row style={{width:'100%',height:'70%'}}>
                <div id="waterChart" style={{width:'85%',height:'270px'}}/>
              </Row>
            </Col>
            <Col className={styles.statistics}>
              <span className={styles.headIcon}><Icon type="bar-chart" style={{marginRight:'10px'}}/>天然气量统计</span>
              <Row style={{width:'100%',height:'20%'}}>
                <Col style={{textAlign:'center',width:'50%',float:'left'}}>
                  <div>
                    <span style={{fontSize:'35px'}}>{this.state.energyAnalysis.gasAnalysis.monthlyGas || 0}</span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>同比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#FF7F50'}}>
                      {this.state.energyAnalysis.gasAnalysis.comparedSameMonth[0] ? '+':'-'}
                      {this.state.energyAnalysis.gasAnalysis.comparedSameMonth[1] || 0}
                    </span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>环比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#4AD089'}}>
                      {this.state.energyAnalysis.gasAnalysis.monthOnMonth[0] ? '+':'-'}
                      {this.state.energyAnalysis.gasAnalysis.monthOnMonth[1] || 0}
                    </span>
                  </div>
                  <div style={{fontSize:'20px'}}>{this.state.month}月用天然气量(m³)</div>
                </Col>
                <Col style={{textAlign:'center',width:'50%',float:'left'}}>
                  <div>
                    <span style={{fontSize:'35px'}}>{this.state.energyAnalysis.gasAnalysis.totalGasYear || 0}</span>
                    <span style={{fontSize:'18px',marginLeft:'5px'}}>同比</span>
                    <span style={{fontSize:'22px',marginLeft:'5px',color:'#FF7F50'}}>
                      {this.state.energyAnalysis.gasAnalysis.annualBasis[0] ? '+':'-'}
                      {this.state.energyAnalysis.gasAnalysis.annualBasis[1] || 0}
                    </span>
                  </div>
                  <div style={{fontSize:'20px'}}>本年用天然气量(m³)</div>
                </Col>
              </Row>
              <Row  style={{textAlign:'center',fontSize:'18px',fontWeight:'bold',marginTop:'10px',marginBottom:'10px'}}>全年天然气量统计</Row>
              <Row style={{width:'100%',height:'70%'}}>
                <div id="qChart" style={{width:'85%',height:'270px'}}/>
              </Row>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}

export default Home;

