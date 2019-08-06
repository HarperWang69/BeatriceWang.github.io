import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Alert, Input, Button } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
 

  handleSubmit = (err, values) => {
    const { dispatch,form: { validateFields} } = this.props;
    validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'login/login',
        payload: {
          ...fieldsValue,
          "platForm": "ANDROID",
        },
      });
    })
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { form: { getFieldDecorator }, submitting } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.loginHeader}>用户名登录</div>
        <div className={styles.loginBody}>
         
          <FormItem>
            {getFieldDecorator('account', {
              rules: [
                {
                  required: true,
                  message: '请输入账号',
                },
              ],
            })(<Input size="large" placeholder="请输入账号" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('pwd', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ],
            })(<Input size="large" type="password" placeholder="请输入密码！" />)}
          </FormItem>
          <Button type='primary' style={{width:'100%'}} loading={submitting} onClick={this.handleSubmit} >登 录</Button>
        </div>
      </div>
    );
  }
}

export default LoginPage;
