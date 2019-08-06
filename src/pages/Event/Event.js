/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Modal , Card, Select, message, DatePicker, Table, Cascader  } from 'antd';
import { connect } from 'dva';
import NormalTable from "@/components/NormalTable";
import DescriptionList from '@/components/DescriptionList';
import styles from './Event.less';
import moment from 'moment';
import logo from './../../assets/logo/login_logo.png';

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Description  } = DescriptionList ;
/**
 * 添加or修改弹出层
 * */
const CreateForm = Form.create()(props => {
  const { that, form: { getFieldDecorator, validateFields, resetFields } } = props;
  // modalUseful:弹层用途，添加/修改
  // modalVisible:弹层开关状态，true/false
  const { eventId, modalVisible, modalUseful } = that.state;
  const { event:{Detail}, dispatch } = that.props;

  const columns = [
    {
      title: '操作人',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    },  
  ]
  // 放大
  const enlarge = (src) => {
    if(src){
      that.setState({imgVisible:true,imgSrc:src});
    }
  }
  // 提交
  const okHandle = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      if(modalUseful === "添加"){
        that.handleAdd({...fieldsValue});
      }else if(modalUseful === "修改"){
        that.handleEdit({...fieldsValue, eventId:Detail.eventId});
      }
    });
  };
  // 上报
  const handleReportModal = () => {
    dispatch({
      type: 'option/fetchSuperSelect',
      payload: eventId,
    })
    that.setState({
      reportModalVisible: true,
    });
  };
  // 下派
  const handleSubordModal = () => {
    dispatch({
      type: 'option/fetchSubperSelect',
      payload: eventId,
    })
    that.setState({
      subordModalVisible: true,
    });
  };
  // 确认完成
  const handleFinish = () => {
    confirm({
      title: '确认后该工单将视为合格并关闭',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'event/finishEvent',
          payload: {eventId:Detail.eventId},
          callback: res => {
            if (res.code === 200) {
              dispatch({
                type: 'event/fetchList',
                payload: that.state.formValues,
              });
              that.setState({modalVisible: false});
              message.success('确认完成');
            }else {
              message.error(`操作失败。错误信息：${res.message}`);
            }
          },
        });
      },
    });
  };
  return (
    <Modal
      title={modalUseful}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => that.handleModalVisible(false)}
      footer={(
        <Fragment>
          {Detail && Detail.editable && Detail && (Detail.eventState === '已上报'|| Detail.eventState ===  '报上级处理') && (<Button type="primary" onClick={handleReportModal}>上报</Button>)}
          {Detail && Detail.editable && Detail && (Detail.eventState === '已上报'|| Detail.eventState ===  '报上级处理' || Detail.eventState ===  '接单退回') && (<Button type="primary" onClick={handleSubordModal}>下派</Button>)}
          {Detail && Detail.editable && Detail && (Detail.eventState === '已上报'|| Detail.eventState ===  '报上级处理' || Detail.eventState ===  '已处理') && (<Button type="primary" onClick={()=>that.setState({backModalVisible:true})}>退回</Button>)}
          {Detail && Detail.editable && Detail && (Detail.eventState === '已处理') && (<Button type="primary" onClick={handleFinish}>完成</Button>)}
        </Fragment>
      )}
      destroyOnClose
      width={1500}
    >
      <DescriptionList col={3}>
        <Description term="事件编号">{Detail && Detail.eventNo || ''}</Description>
        <Description term="事件等级">{Detail && Detail.eventLev || ''}</Description>
        <Description term="事件类型">{Detail && Detail.eventType || ''}</Description>
        <Description term="事件网格">{Detail && Detail.grid || ''}</Description>
        <Description term="事件位置">{Detail && Detail.locationDes || ''}</Description>
        <Description term="事件状态">{Detail && Detail.eventState || ''}</Description>
      </DescriptionList>
      <DescriptionList col={2} style={{marginTop: 20}}>
        <Description term="上报人">{Detail && Detail.reporter || ''}</Description>
        <Description term="上报时间">{Detail && Detail.reportTime || ''}</Description>
        <Description term="事件描述">{Detail && Detail.remark || ''}</Description>
        <Description term="现场照片">
          {Detail && Detail.reportImg && Detail.reportImg.map(item => { return (
              <img src={item} key={item} alt='暂无图片' style={{width: '27%',marginRight: 5}} onClick={()=>{enlarge(item)}} />
          )})}
        </Description>
        <Description term="处理人">{Detail && Detail.dealer || ''}</Description>
        <Description term="处理时间">{Detail && Detail.dealTime || ''}</Description>
        <Description term="处理描述">{Detail && Detail.dealDes || ''}</Description>
        <Description term="处理照片">
          {Detail && Detail.dealImg && Detail.dealImg.map(item => { return (
              <img src={item} key={item} alt='暂无图片' style={{width: '27%',marginRight: 5}} onClick={()=>{enlarge(item)}} />
          )})}
        </Description>
      </DescriptionList>
      <Table columns={columns} dataSource={Detail && Detail.eventLog} style={{marginTop: 20}} pagination={false} />
    </Modal>
  );
});



@connect(({ event, option, loading }) => ({
  event,
  option,
  loading: loading.effects['event/fetchList'],
}))

@Form.create()

class Event extends PureComponent {
  state = {
    formValues: {
      "endTimeDeal": undefined,
      "endTimeReport": undefined,
      "eventLevId": "",
      "eventStateId": "",
      "eventTypeId": "",
      "keyWords": "",
      "pageNum": 1,
      "pageSize": 10,
      "startTimeDeal": undefined,
      "startTimeReport": undefined,
    },
    eventId:'',
    modalUseful:'', // 弹层用途，“添加”or“修改”
    modalVisible: false, // 添加or修改弹出层的开关状态
    reportModalVisible: false, // 上报
    subordModalVisible: false, // 下派
    backModalVisible: false, // 退回
    imgVisible: false,
    imgSrc: '',
  };

  componentDidMount() {
    this.initFetch()
  }

  // 初始化数据列表
  initFetch = () => {
    const { dispatch } = this.props;
    // 事件列表
    dispatch({
      type: 'event/fetchList',
      payload: {
        "endTimeDeal": undefined,
        "endTimeReport": undefined,
        "eventLevId": "",
        "eventStateId": "",
        "eventTypeId": "",
        "keyWords": "",
        "pageNum": 1,
        "pageSize": 10,
        "startTimeDeal": undefined,
        "startTimeReport": undefined,
      },
    });
    // 事件紧急程度(等级)
    dispatch({ type: 'option/fetchEventEmergencyLevel' });
    // 事件状态
    dispatch({ type: 'option/fetchEventStateSelect' });
    // 事件类型
    dispatch({ type: 'option/fetchEventTypeTree' });
    
  }

  // 分页+表头筛选
  handleStandardTableChange = (pagination,filters) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({formValues:params},()=>{
      dispatch({
        type: 'event/fetchList',
        payload: params,
      });
    })
  };

  /**
   *控制弹出层
   *@param {boolean} flag (弹出层开关状态)
   *@param {object} row (需要修改的所在行数据)
   *@param {string} modalUseful (弹出层用途，"添加"or"修改")
   */
  handleModalVisible = (flag, row, modalUseful) => {
    const { dispatch } = this.props;
    if(flag && modalUseful === '查看'){
      dispatch({
        type: 'event/findDetail',
        payload: {eventId: row.eventId},
      })
    }
    if(!flag){
      dispatch({type:'event/clear'})
    }
    this.setState({
      modalVisible: !!flag,
      modalUseful,
      eventId: row && row.eventId || '',
    });
  };

  // 上报
  handleReport = () => {
    const { dispatch, form:{validateFields}, option:{superSelect} } = this.props;
    const { eventId } = this.state;
    const that = this;
    validateFields(['super'],(err, fieldsValue) => {
      if (err) return;
      const gridId = superSelect.find(item => item.value === fieldsValue.super ).gridId;
      dispatch({
        type: 'event/reportEvent',
        payload: {
          nextOperator: fieldsValue.super,
          gridId,
          eventId,
        },
        callback:res=>{
          if(res.code === 200){
            that.setState({
              reportModalVisible: false,
              modalVisible: false,
            });
            dispatch({
              type: 'event/fetchList',
              payload: that.state.formValues,
            });
            message.success('已转报上级');
          }else{
            message.error(`操作失败。错误信息：${res.message}`);
          }
        },
      });
    });
  };

  // 下派
  handleSubord = () => {
    const { dispatch, form:{validateFields} } = this.props;
    const { eventId } = this.state;
    const that = this;
    validateFields(['subper'],(err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'event/subordEvent',
        payload: {
          nextOperator: fieldsValue.subper,
          eventId,
        },
        callback:res=>{
          if(res.code === 200){
            that.setState({
              subordModalVisible: false,
              modalVisible: false,
            });
            dispatch({
              type: 'event/fetchList',
              payload: that.state.formValues,
            });
            message.success('已下派工单');
          }else{
            message.error(`操作失败。错误信息：${res.message}`);
          }
        },
      });
    });
  };

  // 退回
  handleBack = () => {
    const { dispatch, form:{validateFields} } = this.props;
    const { eventId } = this.state;
    const that = this;
    validateFields(['reason'],(err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'event/backEvent',
        payload: {
          ...fieldsValue,
          eventId,
        },
        callback:res=>{
          if(res.code === 200){
            that.setState({
              backModalVisible: false,
              modalVisible: false,
            });
            dispatch({
              type: 'event/fetchList',
              payload: that.state.formValues,
            });
            message.success('已退回');
          }else{
            message.error(`操作失败。错误信息：${res.message}`);
          }
        },
      });
    });
  };

  // 搜索栏
  renderForm() {
    const { getFieldDecorator, validateFields, resetFields } = this.props.form;
    const { dispatch, option:{eventTypeTree, eventEmergencyLevel, eventStateSelect} } = this.props;
    // 搜索
    // 搜索
    const handleSearch = e => {
      e.preventDefault();

      validateFields(['keyWords','eventLevId','eventStateId','eventTypeIdMap','reportTime','dealTime'],(err, fieldsValue) => {
        if (err) return;
  
        const values = {
          "pageNum": 1,
          "pageSize": 10,
          ...fieldsValue,
          "eventTypeId": fieldsValue.eventTypeIdMap && fieldsValue.eventTypeIdMap.length>0 && fieldsValue.eventTypeIdMap[1] || '',
          "startTimeReport": fieldsValue.reportTime && fieldsValue.reportTime.length>0 && fieldsValue.reportTime[0] && moment(fieldsValue.reportTime[0]).format('YYYY-MM-DD') || undefined,
          "endTimeReport": fieldsValue.reportTime && fieldsValue.reportTime.length>0 && fieldsValue.reportTime[1] && moment(fieldsValue.reportTime[1]).format('YYYY-MM-DD') || undefined,
          "startTimeDeal": fieldsValue.dealTime && fieldsValue.dealTime.length>0 && fieldsValue.dealTime[0] && moment(fieldsValue.dealTime[0]).format('YYYY-MM-DD') || undefined,
          "endTimeDeal": fieldsValue.dealTime && fieldsValue.dealTime.length>0 && fieldsValue.dealTime[1] && moment(fieldsValue.dealTime[1]).format('YYYY-MM-DD') || undefined,
        };
  
        this.setState({
          formValues: values,
        }, () => {
          dispatch({
            type: 'event/fetchList',
            payload: values,
          });
        });
      });
    };

    const handleFormReset = () => {
      resetFields();
      this.setState({
        formValues: {
          "endTimeDeal": undefined,
          "endTimeReport": undefined,
          "eventLevId": "",
          "eventStateId": "",
          "eventTypeId": "",
          "keyWords": "",
          "pageNum": 1,
          "pageSize": 10,
          "startTimeDeal": undefined,
          "startTimeReport": undefined,
        },
      });
      dispatch({
        type: 'event/fetchList',
        payload: {
          "pageNum": 1,
          "pageSize": 10,
        },
      });
    }

    return (
      <Form onSubmit={handleSearch} layout="inline">
        <FormItem label="模糊搜索">
          {getFieldDecorator('keyWords')(<Input placeholder="请输入网格名称" />)}
        </FormItem>
        <FormItem label="事件等级">
          {getFieldDecorator('eventLevId')(
            <Select placeholder="请选择" style={{ width: 200 }}>
              {eventEmergencyLevel && eventEmergencyLevel.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="事件状态">
          {getFieldDecorator('eventStateId')(
            <Select placeholder="请选择" style={{ width: 200 }}>
              {eventStateSelect && eventStateSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="事件类型">
          {getFieldDecorator('eventTypeIdMap')(
            <Cascader
              options={eventTypeTree}
              placeholder="请选择"
              style={{width:300}}
            />
          )}
        </FormItem>
        <FormItem label="上报时间">
          {getFieldDecorator('reportTime')(<RangePicker />)}
        </FormItem>
        <FormItem label="处理时间">
          {getFieldDecorator('dealTime')(<RangePicker />)}
        </FormItem>
        <div className={styles.searchForm}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
            重置
          </Button>
        </div>  
      </Form>
    )
  }

  render() {
    const { event: { List }, loading } = this.props;
    const { form:{getFieldDecorator}, option:{superSelect, subperSelect} } = this.props;
    const { reportModalVisible, subordModalVisible, backModalVisible, imgVisible, imgSrc } = this.state;
    // const List = {
    //   list:[
    //     {
    //       "eventNo": "10110",
    //       "grid": "环湖南路",
    //       "eventType": "事件类型",
    //       "eventLev": "一般",
    //       "reporter": "张三",
    //       "dealer": "王五",
    //       "reportTime": "2019-05-15",
    //       "dealTime": "2019-06-28",
    //       "eventState":"已上报",
    //       "locationDes":"政府大楼3楼",
    //       "editable":0,
    //       "reportDes":"xxx已上报",
    //       "reportImg":["http://123.png"],
    //       "dealDes":"xxx已上报",
    //       "dealImg":["http://123.png"],
    //       "eventLog":[
    //         {
    //           "person": "操作人",
    //           "time": "操作时间",
    //           "state": "状态",
    //         },
    //       ],
    //     }
    //   ],
    //   pagination:{
    //     "current": 1,
    //     "pageSize": 10,
    //     "total": 1
    //   }
    // }

    const columns = [
      {
        title: '序号',
        key: 'num',
        width: 75,
        render: (text, record, index) => index+1,
        align: 'center',
      },
      {
        title: '事件编号',
        dataIndex: 'eventNo',
        key: 'eventNo',
        width: 100,
        align: 'center',
      },
      {
        title: '事件网格',
        dataIndex: 'grid',
        key: 'grid',
        align: 'center',
      },
      {
        title: '事件类型',
        dataIndex: 'eventType',
        key: 'eventType',
        align: 'center',
      },
      {
        title: '事件等级',
        dataIndex: 'eventLev',
        key: 'eventLev',
        align: 'center',
      },
      {
        title: '上报人',
        dataIndex: 'reporter',
        key: 'reporter',
        align: 'center',
        width: 100,
      },
      {
        title: '处理人',
        dataIndex: 'dealer',
        key: 'dealer',
        align: 'center',
        width: 100,
      },
      {
        title: '上报时间',
        dataIndex: 'reportTime',
        key: 'reportTime',
        align: 'center',
      },
      {
        title: '处理时间',
        dataIndex: 'dealTime',
        key: 'dealTime',
        align: 'center',
      },
      {
        title: '事件状态',
        dataIndex: 'eventState',
        key: 'eventState',
        align: 'center',
      },
      {
        title: '操作',
        key: 'do',
        width: 75,
        align: 'center',
        render: row => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true,row,"查看")}>查看</a>
          </Fragment>
        ),
      },
    ];


    return (
      <Fragment>
        <Card bordered={false} style={{marginBottom: 20}}>
          <div className={styles.filerList}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <NormalTable
            loading={loading}
            data={List}
            rowKey={(text,index) => index}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <CreateForm that={this} />
        <Modal
          title='转报上级'
          visible={reportModalVisible}
          onOk={this.handleReport}
          onCancel={() => {this.setState({reportModalVisible:false})}}
          destroyOnClose
        >
          <Form layout="inline">
            <FormItem label="选择上一级处理人">
              {getFieldDecorator('super', {
                rules: [{ required: true, message: '请选择上一级处理人' }],
              })(
                <Select placeholder="请选择" style={{ width: 150 }}>
                  {superSelect && superSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title='下派工单'
          visible={subordModalVisible}
          onOk={this.handleSubord}
          onCancel={() => {this.setState({subordModalVisible:false})}}
          destroyOnClose
        >
          <Form layout="inline">
            <FormItem label="选择处理人">
              {getFieldDecorator('subper', {
                rules: [{ required: true, message: '请选择处理人' }],
              })(
                <Select placeholder="请选择" style={{ width: 150 }}>
                  {subperSelect && subperSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title='退回'
          visible={backModalVisible}
          onOk={this.handleBack}
          onCancel={() => {this.setState({backModalVisible:false})}}
          destroyOnClose
        >
          <Form layout="inline">
            <FormItem label="退回原因">
              {getFieldDecorator('reason')(<Input  />)}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={imgVisible}
          footer={null}
          onCancel={() => {this.setState({imgVisible:false})}}
          destroyOnClose
          width={1500}
        >
          <img src={imgSrc} alt='' width='100%' />
        </Modal>
      </Fragment>
    );
  }
}

export default Event;
