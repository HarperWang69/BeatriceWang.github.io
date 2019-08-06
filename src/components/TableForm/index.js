import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Select, message, Popconfirm, Divider } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './index.less';

/* eslint-disable-next-line react/no-unused-state */
const { Option } = Select;

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    let colKey=[];
    props.columns.forEach(element => {
      if((element.colType === 'input' || element.colType === 'select') && element.required){
        colKey.push(element.dataIndex);
      }
      return colKey
    });
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
      columns: props.columns,
      keys: colKey,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data,keys } = this.state;
    const newData = data.map(item => ({ ...item }));
    let newValue = {};
    keys.forEach(value => {
     
      return newValue[value] = '';
    })
    
    newData.push({
      ...newValue,
      key: `NEW_TEMP_ID_${this.index}`,
      editable: true,
      isNew: true,
    });
   
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = ( e.target && e.target.value ) || null;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const { keys } = this.state;
      const target = this.getRowByKey(key) || {};
      let flag = true;
      keys.some(value => {
        if(!target[value]){
          flag = false;
          message.error('请填写完整信息。');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return true;
        }
      })
      if(!flag){ return; }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  
  formatCol = (columns) => {
    let col = [];
    columns.map((value,index) => {
      if(value.colType === 'input'){
        value.render = (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text&&text.toString()==="[object Object]"?'':text}
                onChange={e => this.handleFieldChange(e, value.dataIndex, record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder={value.title}
              />
            );
          }
          return text;
        };
      }else if(value.colType === 'select'){
        value.render = (text, record) => {
          if (record.editable) {
            return (
              <Select
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, value.dataIndex, record.key)}
                {...value.selRest}
              >
                {value.selOption && value.selOption.map(option => (<Option value={option.value} key={option.value}>{option.text}</Option>))}
              </Select>
            );
          }
          return text;
        };
      };
      if(!value.align){
        value.align = 'center';
      };
      return col.push(value);
    });
    col.push(
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    )
    
    return col;
  }
  render() {

    const { loading, data, columns } = this.state;
    return (
      <Fragment>
        <Table
          loading={loading}
          columns={this.formatCol(columns)}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          添加
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;