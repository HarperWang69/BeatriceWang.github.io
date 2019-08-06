/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Modal , Card, Select, message, Divider  } from 'antd';
import { connect } from 'dva';
import NormalTable from "@/components/NormalTable";
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from './Grid.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const { Description  } = DescriptionList ;
/**
 * 添加or修改弹出层
 * */
const CreateForm = Form.create()(props => {
  const { that, form: { getFieldDecorator, validateFields, resetFields } } = props;
  // modalUseful:弹层用途，添加/修改
  // modalVisible:弹层开关状态，true/false
  const { modalVisible, modalUseful } = that.state;
  const { grid:{Detail}, option:{ gridShapeSelect, gridTypeSelect, gridLevelSelect } } = that.props;
//   const Detail = {
//     "gridNo": "10110",
//     "grid": "环湖南路",
//     "gridShape": "条状网格",
//     "gridShapeId": 1,
//     "gridType": "主干道",
//     "gridTypeId": 2,
//     "gridPrcp": [
//         {
//            name:"张三",
//            telephone:"13123456789"
//         },
//         {
//            name:"李四",
//            telephone:"13123456789"
//         },
//     ],
//     "gridMemb": [
//         "张三二","张三二"
//     ],
//     "gridLev": "二级",
//     "gridLocDes": "团泊镇政府办公楼3层",
//     "remark": "备注"
// }
  // 修改时不可编辑
  const disabled = modalUseful === "修改";

  // 提交
  const okHandle = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      if(modalUseful === "添加"){
        that.handleAdd({...fieldsValue});
      }else if(modalUseful === "修改"){
        that.handleEdit({...fieldsValue, gridId:Detail.gridId});
      }
    });
  };

  return (
    <Modal
      title={modalUseful}
      visible={modalVisible}
      footer={ modalUseful === '查看'? null : [
        <Button key="back" onClick={() => that.handleModalVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={okHandle}>
          确定
        </Button>,
      ]}
      // onOk={okHandle}
      onCancel={() => that.handleModalVisible(false)}
      destroyOnClose
    >
      {modalUseful==='查看' &&  (
        <DescriptionList col={1}>
          <Description term="网格编号">{Detail && Detail.gridNo || ''}</Description>
          <Description term="网格类型">{Detail && Detail.gridType || ''}</Description>
          <Description term="网格形态">{Detail && Detail.gridShape || ''}</Description>
          <Description term="网格名称">{Detail && Detail.grid || ''}</Description>
          <Description term="位置描述">{Detail && Detail.gridLocDes || ''}</Description>
          <Description term="备注">{Detail && Detail.remark || ''}</Description>
          <Description term="网格负责人">
            {Detail && Detail.gridPrcp && Detail.gridPrcp.map(item => {
              return `${item.name}(${item.telephone}) `
            })}
          </Description>
          <Description term="网格员名单">
            {Detail && Detail.gridMemb && Detail.gridMemb.map((item, index) => {
              return index < Detail.gridMemb.length-1? `${item}、` : item
            })}
          </Description>
        </DescriptionList>
      )}
      {modalUseful!=='查看' && (
        <Fragment>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="网格编号">
            {getFieldDecorator('gridNo', {
              initialValue: modalUseful === "修改" && Detail && Detail.gridNo || '',
            })(<Input disabled={disabled} placeholder="请输入网格编号" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="网格形态">
            {getFieldDecorator('gridShapeId', {
              rules: [{ required: true, message: '请选择网格形态' }],
              initialValue: modalUseful === "修改" && Detail && Detail.gridShapeId || '',
            })(
              <Select disabled={disabled} placeholder="请选择" style={{ width: 200 }}>
                {gridShapeSelect && gridShapeSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="网格类型">
            {getFieldDecorator('gridTypeId', {
              rules: [{ required: true, message: '请选择网格类型' }],
              initialValue: modalUseful === "修改" && Detail && Detail.gridTypeId || '',
            })(
              <Select disabled={disabled} placeholder="请选择" style={{ width: 200 }}>
                {gridTypeSelect && gridTypeSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="网格等级">
            {getFieldDecorator('gridLevId', {
              rules: [{ required: true, message: '请选择网格等级' }],
              initialValue: modalUseful === "修改" && Detail && Detail.gridLevId || '',
            })(
              <Select disabled={disabled} placeholder="请选择" style={{ width: 200 }}>
                {gridLevelSelect && gridLevelSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="网格名称">
            {getFieldDecorator('grid', {
              rules: [{ required: true, message: '请输入网格名称' }],
              initialValue: modalUseful === "修改" && Detail && Detail.grid || '',
            })(<Input placeholder="请输入网格名称" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="位置描述">
            {getFieldDecorator('gridLocDes', {
              initialValue: modalUseful === "修改" && Detail && Detail.gridLocDes || '',
            })(<Input placeholder="请输入位置描述" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
            {getFieldDecorator('remark', {
              initialValue: modalUseful === "修改" && Detail && Detail.remark || '',
            })(<Input placeholder="请输入备注" />)}
          </FormItem>
        </Fragment>
      )}
      
    </Modal>
  );
});



@connect(({ grid, option, loading }) => ({
  grid,
  option,
  loading: loading.effects['grid/fetchList'],
}))

@Form.create()

class Grid extends PureComponent {
  state = {
    modalUseful:'', // 弹层用途，“添加”or“修改”
    modalVisible: false, // 添加or修改弹出层的开关状态
    formValues: {
      "gridLevId": '',
      "gridShapeId": "",
      "gridTypeId": "",
      "keyWords": "",
      "pageNum": 1,
      "pageSize": 10
    },
  };

  componentDidMount() {
    this.initFetch()
  }

  // 初始化数据列表
  initFetch = () => {
    const { dispatch } = this.props;
    // 部门列表
    dispatch({
      type: 'grid/fetchList',
      payload: {
        "gridLevId": '',
        "gridShapeId": "",
        "gridTypeId": "",
        "keyWords": "",
        pageNum: 1,
        pageSize: 10,
      },
    });
    // 网格等级
    dispatch({ type: 'option/fetchGridLevelSelect' });
    // 网格形态
    dispatch({ type: 'option/fetchGridShapeSelect' });
    // 网格类型
    dispatch({ type: 'option/fetchGridTypeSelect' });
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
        type: 'grid/fetchList',
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
    if(flag && modalUseful !== '添加'){
      dispatch({
        type: 'grid/findDetail',
        payload: {gridId: row.gridId},
      })
    }
    if(!flag){
      dispatch({type:'grid/clear'})
    }
    this.setState({
      modalVisible: !!flag,
      modalUseful,
    });
  };

  // 添加，成功后返回列表的第一页
  handleAdd = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'grid/add',
      payload: fields,
      callback: res => {
        if (res.code === 200) {
        const params = {
          ...formValues,
          pageNum: 1,
        };
        this.setState({formValues:params},()=>{
          dispatch({
            type: 'grid/fetchList',
            payload: params,
          });
        })
          message.success('添加成功');
        } else {
          message.error(`添加失败。错误信息：${res.message}`);
        }
      },
    });
    this.setState({
      modalVisible: false,
    });
  };

  // 修改，成功后留在列表当前页
  handleEdit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'grid/update',
      payload: fields,
      callback:res=>{
        if(res.code === 200){
          dispatch({
            type: 'grid/fetchList',
            payload: this.state.formValues,
          });
          message.success('修改成功');
        }else{
          message.error(`修改失败。错误信息：${res.message}`);
        }
      },
    });
    this.setState({
      modalVisible: false,
    });
  };

  // 删除，成功后留在列表当前页
  handleDelete = (row) => {
    console.log(row)
    const { dispatch } = this.props
    const that = this;
    confirm({
      title: '你确定要删除此信息么?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'grid/delete',
          payload: {gridId:row.gridId},
          callback: response => {
            const res = JSON.parse(response);
            if (res.code === 200) {
              dispatch({
                type: 'grid/fetchList',
                payload: that.state.formValues,
              });
              message.success('删除成功');
            }else {
              message.error(`删除失败。错误信息：${res.message}`);
            }
          },
        });
      },
    });
  };


  // 搜索栏
  renderForm() {
    const { getFieldDecorator, validateFields, resetFields } = this.props.form;
    const { dispatch, option:{ gridLevelSelect, gridShapeSelect, gridTypeSelect } } = this.props;
    // 搜索
    const handleSearch = e => {
      e.preventDefault();

      validateFields(['keyWords','gridShapeId','gridTypeId','gridLevId'],(err, fieldsValue) => {
        if (err) return;
  
        const values = {
          "pageNum": 1,
          "pageSize": 10,
          ...fieldsValue,
        };
  
        this.setState({
          formValues: values,
        }, () => {
          dispatch({
            type: 'grid/fetchList',
            payload: values,
          });
        });
      });
    };

    const handleFormReset = () => {
      resetFields();
      this.setState({
        formValues: {},
      });
      dispatch({
        type: 'grid/fetchList',
        payload: {
          "pageNum": 1,
          "pageSize": 10,
          "ticket": sessionStorage.getItem('ticket'),
        },
      });
    }

    return (
      <Form onSubmit={handleSearch} layout="inline">
        <FormItem label="模糊搜索">
          {getFieldDecorator('keyWords')(<Input placeholder="请输入网格名称" />)}
        </FormItem>
        <FormItem label="网格形态">
          {getFieldDecorator('gridShapeId')(
            <Select placeholder="请选择" style={{ width: 200 }}>
              {gridShapeSelect && gridShapeSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="网格类型">
          {getFieldDecorator('gridTypeId')(
            <Select placeholder="请选择" style={{ width: 200 }}>
              {gridTypeSelect && gridTypeSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="网格等级">
          {getFieldDecorator('gridLevId')(
            <Select placeholder="请选择" style={{ width: 200 }}>
              {gridLevelSelect && gridLevelSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
            </Select>
          )}
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
    const { grid: { List }, loading } = this.props;
    // const List = {
    //   list:[
    //     {
    //       "gridNo": "10110",
    //       "grid": "环湖南路",
    //       "gridShape": "条状网格",
    //       "gridShapeId": 1,
    //       "gridType": "主干道",
    //       "gridTypeId": 2,
    //       "gridPrcp": [
    //         {
    //           name:"张三",
    //           telephone:"13123456789"
    //         }
    //       ],
    //       "gridMemb": [
    //         "张三二"
    //       ],
    //       "gridLev": "二级",
    //       "gridLocDes": "团泊镇政府办公楼3层",
    //       "remark": "备注"
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
        title: '网格编号',
        dataIndex: 'gridNo',
        key: 'gridNo',
        width: 200,
        align: 'center',
      },
      {
        title: '网格名称',
        dataIndex: 'grid',
        key: 'grid',
        width: 300,
        align: 'center',
      },
      {
        title: '位置描述',
        dataIndex: 'gridLocDes',
        key: 'gridLocDes',
        align: 'center',
      },
      {
        title: '网格形态',
        dataIndex: 'gridShape',
        key: 'gridShape',
        align: 'center',
      },
      {
        title: '网格类型',
        dataIndex: 'gridType',
        key: 'gridType',
        align: 'center',
      },
      {
        title: '网格负责人',
        dataIndex: 'gridPrcp',
        key: 'gridPrcp',
        align: 'center',
        render: text => {
          return text.map(  item => (<span>{item.name} </span>) )
        }
      },
      {
        title: '网格等级',
        dataIndex: 'gridLev',
        key: 'gridLev',
        align: 'center',
      },
      {
        title: '操作',
        key: 'do',
        width: 150,
        align: 'center',
        render: row => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true,row,"查看")}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleModalVisible(true,row,"修改")}>修改</a>
          </Fragment>
        ),
      },
    ];


    return (
      <PageHeaderLayout title='网格管理'>
        <Card bordered={false} style={{marginBottom: 20}}>
          <div className={styles.filerList}>
            {this.renderForm()}
            {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,{},"添加")}>添加</Button> */}
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
      </PageHeaderLayout>
    );
  }
}

export default Grid;
