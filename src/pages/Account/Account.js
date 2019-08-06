/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, Modal , Card, Select, message, Divider, Cascader, Upload, Icon, DatePicker  } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './Account.less';
import NormalTable from "@/components/NormalTable";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;


/**
 * 添加or修改弹出层
 * */
const CreateForm = Form.create()(props => {
  const { that, form: { getFieldDecorator, validateFields, resetFields } } = props;
  // modalUseful:弹层用途，添加/修改
  // modalVisible:弹层开关状态，true/false
  const { modalVisible, modalUseful, avatarLoading, imageUrl } = that.state;
  const { account:{Detail}, option:{ roleTree } } = that.props;

  // 修改时不可编辑
  const disabled = modalUseful === "修改";

  // // 上传
  // const uploadButton = (
  //   <div>
  //     <Icon type={avatarLoading ? 'loading' : 'plus'} />
  //     <div className="ant-upload-text">Upload</div>
  //   </div>
  // );
  
  // function beforeUpload(file) {
  //   const isJPG = file.type === 'image/jpeg';
  //   if (!isJPG) {
  //     message.error('You can only upload JPG file!');
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //   }
  //   return isJPG && isLt2M;
  // }

  // const handleChange = info => {
  //   if (info.file.status === 'uploading') {
  //     that.setState({ avatarLoading: true });
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     that.setState({
  //       imageUrl,
  //       avatarLoading: false,
  //     })
  //   }
  // };


  // 提交
  const okHandle = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      const roleList = fieldsValue.role2 && fieldsValue.role2.length>0?[
        {
          "compId": fieldsValue.role1[0],
          "deptId": fieldsValue.role1[1],
          "gridId": fieldsValue.role1[2],
          "positionId": fieldsValue.role1[3],
        },
        {
          "compId": fieldsValue.role2[0],
          "deptId": fieldsValue.role2[1],
          "gridId": fieldsValue.role2[2],
          "positionId": fieldsValue.role2[3]
        }
      ] : [
        {
          "compId": fieldsValue.role1[0],
          "deptId": fieldsValue.role1[1],
          "gridId": fieldsValue.role1[2],
          "positionId": fieldsValue.role1[3],
        },
      ];
      const entryTime = fieldsValue.entryTime1 && moment(fieldsValue.entryTime1).format('YYYY-MM-DD') || undefined;

      if(modalUseful === "添加"){
        that.handleAdd({...fieldsValue, entryTime, roleList});
      }else if(modalUseful === "修改"){
        that.handleEdit({...fieldsValue, roleList, entryTime, userId: Detail.userId});
      }
    });
  };

  return (
    <Modal
      title={modalUseful}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => that.handleModalVisible(false)}
      destroyOnClose
    >
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上传头像">
        {getFieldDecorator('avatar')(
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? <img src={Detail.imageUrl} alt="avatar" /> : uploadButton}
          </Upload>
        )}
      </FormItem> */}
      {modalUseful !== "修改" && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账户名">
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入账户名' }],
            initialValue: modalUseful === "修改" && Detail && Detail.account || '',
          })(<Input placeholder="请输入账户名" />)}
        </FormItem>
      )}
      {modalUseful !== "修改" && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          {getFieldDecorator('pwd', {
            rules: [{ required: true, message: '请输入密码' }],
            initialValue: modalUseful === "修改" && Detail && Detail.pwd || '',
          })(<Input placeholder="请输入密码" />)}
        </FormItem>
      )}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {getFieldDecorator('userName', {
          rules: [{ required: true, message: '请输入姓名' }],
          initialValue: modalUseful === "修改" && Detail && Detail.userName || '',
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
        {getFieldDecorator('phone', {
          rules: [{ required: true, message: '请输入手机号' }],
          initialValue: modalUseful === "修改" && Detail && Detail.phone || '',
        })(<Input placeholder="请输入手机号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
        {getFieldDecorator('eMail', {
          rules: [{ required: true, message: '请输入邮箱' }],
          initialValue: modalUseful === "修改" && Detail && Detail.eMail || '',
        })(<Input placeholder="请输入邮箱" />)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {getFieldDecorator('genderId', {
          rules: [{ required: true, message: '请选择性别' }],
          initialValue: modalUseful === "修改" && Detail && Detail.genderId || '',
        })(
          <Select placeholder="请选择" style={{ width: '300px' }}>
            <Option value='男'>男</Option>
            <Option value='女'>女</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年龄">
        {getFieldDecorator('age', {
          rules: [{ required: true, message: '请输入年龄' }],
          initialValue: modalUseful === "修改" && Detail && Detail.age || '',
        })(<Input placeholder="请输入年龄" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="政治面貌">
        {getFieldDecorator('pltLookId', {
          rules: [{ required: true, message: '请选择政治面貌' }],
          initialValue: modalUseful === "修改" && Detail && Detail.pltLookId || '',
        })(
          <Select placeholder="请选择" style={{ width: '300px' }}>
            <Option value='中共党员'>中共党员</Option>
            <Option value='中共预备党员'>中共预备党员</Option>
            <Option value='共青团员'>共青团员</Option>
            <Option value='普通居民'>普通居民</Option>
            <Option value='其他'>其他</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="入职时间">
        {getFieldDecorator('entryTime1', {
          rules: [{ required: true, message: '请输入入职时间' }],
          initialValue: modalUseful === "修改" && Detail && Detail.entryTime && moment(Detail && Detail.entryTime) || null,
        })(<DatePicker format='YYYY-MM-DD' style={{ width: '300px' }} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色1">
        {getFieldDecorator('role1', {
          rules: [{ required: true, message: '请输入角色' }],
          initialValue: modalUseful === "修改" && Detail && Detail.roleList && Detail.roleList[0] && [Detail.roleList[0].compId,Detail.roleList[0].deptId,Detail.roleList[0].gridId,Detail.roleList[0].positionId] || [],
        })(
          <Cascader
            options={roleTree}
            changeOnSelect
            placeholder="请选择"
            style={{ width: '300px' }}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色2">
        {getFieldDecorator('role2', {
          initialValue: modalUseful === "修改" && Detail && Detail.roleList && Detail.roleList[1] && [Detail.roleList[1].compId,Detail.roleList[1].deptId,Detail.roleList[1].gridId,Detail.roleList[1].positionId] || [],
        })(
          <Cascader
            options={roleTree}
            changeOnSelect
            placeholder="请选择"
            style={{ width: '300px' }}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {getFieldDecorator('remark', {
          initialValue: modalUseful === "修改" && Detail && Detail.remark || '',
        })(<Input placeholder="请输入备注" />)}
      </FormItem>
    </Modal>
  );
});



@connect(({ account, option, loading }) => ({
  account,
  option,
  loading: loading.effects['account/fetchList'],
}))

@Form.create()

class Account extends PureComponent {
  state = {
    avatarLoading: false,
    modalUseful:'', // 弹层用途，“添加”or“修改”
    modalVisible: false, // 添加or修改弹出层的开关状态
    formValues: { // 列表查询条件
      pageNum: 1, // 页码
      pageSize: 10, // 每页几条
      "compId": "",
      "deptId": "",
      "gender": "",
      "keyWords": "",
      "pltLook": "",
      "positionId": ""
    },
  };

  componentDidMount() {
    this.initFetch()
  }

  // 初始化数据列表
  initFetch = () => {
    const { dispatch } = this.props;
    // 用户列表
    dispatch({
      type: 'account/fetchList',
      payload: {
        "pageNum": 1,
        "pageSize": 10,
        "compId": "",
        "deptId": "",
        "gender": "",
        "keyWords": "",
        "pltLook": "",
        "positionId": "",
      },
    });
    // 组织架构
    dispatch({ type: 'option/fetchDepartTree' });
    // 角色
    dispatch({ type: 'option/fetchRoleTree' });
    // 职位
    dispatch({ type: 'option/fetchPositionSelect' });
  }

  // 分页+表头筛选
  handleStandardTableChange = (pagination,filters) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      sysId: filters.system && filters.system[0],
    };
    this.setState({formValues:params},()=>{
      dispatch({
        type: 'account/fetchList',
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
    if(flag && modalUseful === '修改'){
      dispatch({
        type: 'account/findDetail',
        payload: {userId: row.userId},
      })
    }
    if(!flag){
      dispatch({type:'account/clear'})
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
      type: 'account/add',
      payload: fields,
      callback: res => {
        if (res.code === 200) {
        const params = {
          ...formValues,
          pageNum: 1,
        };
        this.setState({formValues:params},()=>{
          dispatch({
            type: 'account/fetchList',
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
      type: 'account/update',
      payload: fields,
      callback:res=>{
        if(res.code === 200){
          dispatch({
            type: 'account/fetchList',
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
    const { dispatch } = this.props
    const that = this;
    confirm({
      title: '你确定要删除此信息么?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'account/delete',
          payload: row.userId,
          callback: res => {
            if (res.code === 200) {
              dispatch({
                type: 'account/fetchList',
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
    const { dispatch, option:{ departTree, positionSelect } } = this.props;
    // 搜索
    const handleSearch = e => {
      e.preventDefault();

      validateFields(['keyWords','gender','pltLook','positionId','org'],(err, fieldsValue) => {
        if (err) return;
  
        const values = {
          "pageNum": 1,
          "pageSize": 10,
          ...fieldsValue,
          "compId": fieldsValue.org && fieldsValue.org.length>0 && fieldsValue.org[0] || '',
          "deptId": fieldsValue.org && fieldsValue.org.length>1 && fieldsValue.org[1] || '',
        };
  
        this.setState({
          formValues: values,
        }, () => {
          dispatch({
            type: 'account/fetchList',
            payload: values,
          });
        });
      });
    };

    const handleFormReset = () => {
      resetFields();
      this.setState({
        formValues: { 
          pageNum: 1, 
          pageSize: 10, 
          "compId": "",
          "deptId": "",
          "gender": "",
          "keyWords": "",
          "pltLook": "",
          "positionId": ""
        },
      });
      dispatch({
        type: 'account/fetchList',
        payload: {
          "pageNum": 1,
          "pageSize": 10,
        },
      });
    }

    return (
      <Form onSubmit={handleSearch} layout="inline">
        <FormItem label="模糊搜索">
          {getFieldDecorator('keyWords')(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem label="性别">
          {getFieldDecorator('gender')(
            <Select placeholder="请选择" style={{ width: 100 }}>
              <Option value='男'>男</Option>
              <Option value='女'>女</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="政治面貌">
          {getFieldDecorator('pltLook')(
            <Select placeholder="请选择" style={{ width: 150 }}>
              <Option value='中共党员'>中共党员</Option>
              <Option value='中共预备党员'>中共预备党员</Option>
              <Option value='共青团员'>共青团员</Option>
              <Option value='普通居民'>普通居民</Option>
              <Option value='其他'>其他</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="职位">
          {getFieldDecorator('positionId')(
            <Select placeholder="请选择" style={{ width: 100 }}>
            {positionSelect && positionSelect.map(option => (<Option value={option.value} key={option.value}>{option.label}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="组织架构">
          {getFieldDecorator('org')(
            <Cascader
              options={departTree}
              changeOnSelect
              placeholder="请选择"
              style={{width:350}}
            />
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
    const { account: { List }, loading } = this.props;
    

    const columns = [
      {
        title: '序号',
        key: 'num',
        width: 75,
        render: (text, record, index) => index+1,
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: 120,
        align: 'center',
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 75,
        align: 'center',
      },
      {
        title: '政治面貌',
        dataIndex: 'pltLook',
        key: 'pltLook',
        align: 'center',
        width: 120,
      },
      {
        title: '角色',
        dataIndex: 'roleDes',
        key: 'roleDes',
        width: 200,
        align: 'center',
      },
      {
        title: '所属单位用户',
        dataIndex: 'orgStructure',
        key: 'orgStructure',
        width: 200,
        align: 'center',
      },
      {
        title: '入职时间',
        dataIndex: 'entryTime',
        key: 'entryTime',
        width: 120,
        align: 'center',
      },
      {
        title: '操作',
        key: 'do',
        width: 120,
        align: 'center',
        render: row => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true,row,"修改")}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(row)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title='人员管理'>
        <Card bordered={false} style={{marginBottom: 20}}>
          <div className={styles.filerList}>
            {this.renderForm()}
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,{},"添加")}>添加</Button>
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

export default Account;
