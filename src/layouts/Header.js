import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Popover, Progress, Layout, message } from 'antd';
import router from 'umi/router';
import Animate from 'rc-animate';
import GlobalHeader from '@/components/GlobalHeader';
import styles from './Header.less';

const { Header } = Layout;
const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：弱</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

/**
 * 添加or修改弹出层
 **/ 
const CreateForm = Form.create()(props => {
  const { _this, form: { getFieldDecorator, validateFields, resetFields, getFieldValue } } = props;
  // modalUseful:弹层用途，添加/修改
  // modalVisible:弹层开关状态，true/false
  const { PWDmodalVisible, help, PWDvisible, confirmDirty } = _this.state;
  const { dispatch } = _this.props;
  
  const getPasswordStatus = () => {
    const value = getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  const renderPasswordProgress = () => {
    const value = getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  const checkPassword = (rule, value, callback) => {
    if (!value) {
      _this.setState({
        help: '请输入密码！',
        PWDvisible: !!value,
      });
      callback('error');
    } else {
      _this.setState({
        help: '',
      });
      if (!PWDvisible) {
        _this.setState({
          PWDvisible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        if (value && confirmDirty) {
          validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };
  const checkConfirm = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };
  // 提交
  const okHandle = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'login/updatePwd',
        payload: {
          ...fieldsValue,
          ticket: sessionStorage.getItem('ticket'),
        },
        callback: res => {
          if(res.code === 0){
            resetFields();
            _this.handlePwd(false);
            _this.props.history.push('/user/login');
          }else{
            message.error(`修改密码失败，${res.message}`)
          }
        }
      });
      
        
    });
  };

  return (
    <Modal
      title="修改密码"
      visible={PWDmodalVisible}
      onOk={okHandle}
      onCancel={() => _this.handlePwd(false)}
      destroyOnClose //关闭时销毁 Modal 里的子元素
    >
       <FormItem>
        {getFieldDecorator('oldPassword', {
          rules: [
            {
              required: true,
              message: '请输入旧密码！',
            },
          ],
        })(<Input size="large" type="password" placeholder="请输入旧密码！" />)}
      </FormItem>
      <FormItem help={help}>
        <Popover
          getPopupContainer={node => node.parentNode}
          content={
            <div style={{ padding: '4px 0' }}>
              {passwordStatusMap[getPasswordStatus()]}
              {renderPasswordProgress()}
              <div style={{ marginTop: 10 }}>
                请至少输入 6 个字符。请不要使用容易被猜到的密码。
              </div>
            </div>
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          visible={PWDvisible}
        >
          {getFieldDecorator('password', {
            rules: [
              {
                validator: checkPassword,
              },
            ],
          })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
        </Popover>
      </FormItem>
      <FormItem>
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: '请确认密码！',
            },
            {
              validator: checkConfirm,
            },
          ],
        })(<Input size="large" type="password" placeholder="确认密码" />)}
      </FormItem>
    </Modal>
  );
});

class HeaderView extends PureComponent {
  state = {
    visible: true,
    PWDmodalVisible: false,
    confirmDirty: false,
    PWDvisible: false,
    help: '',
  };

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handleNoticeClear = type => {
    message.success(`清空了${type === 'notification'? '通知':type === 'message'? '消息':'待办'}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handlePwd = flag => {
    this.setState({
      PWDmodalVisible: !!flag,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings');
      return;
    }
    if (key === 'lock') {
      this.handlePwd(true);
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { layout, fixedHeader } = setting;
    const { visible } = this.state;
    const width = this.getHeadWidth();
    const isTop = layout === 'topmenu';

    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <div>topmenu</div>
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onNoticeClear={this.handleNoticeClear}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
        <CreateForm _this={this} />
      </Header>
    ) : null;
    return <Animate transitionName="fade">{HeaderDom}</Animate>;
  }
}

export default connect(({ login,user, global, setting, loading }) => ({
  // currentUser: user.currentUser,
  currentUser: JSON.parse(sessionStorage.getItem('user')),
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  loadedAllNotices: global.loadedAllNotices,
  notices: global.notices,
  setting,
}))(HeaderView);
