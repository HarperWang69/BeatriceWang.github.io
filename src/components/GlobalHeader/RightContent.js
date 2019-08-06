import React, { Component } from 'react';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class RightContent extends Component {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  handleLogout (){
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  }
  fetchMoreNotices = tabProps => {
    const { list, name } = tabProps;
    const { dispatch, notices = [] } = this.props;
    const lastItemId = notices[notices.length - 1].id;
    dispatch({
      type: 'global/fetchMoreNotices',
      payload: {
        lastItemId,
        type: name,
        offset: list.length,
      },
    });
  };
  render() {
    const {
      currentUser,
      loadedAllNotices,
      fetchingMoreNotices,
      onMenuClick,
      onNoticeVisibleChange,
      fetchingNotices,
      onNoticeClear,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} onClick={onMenuClick}>
        {/* <Menu.Item key="lock">
          <Icon type="lock" />
          修改密码
        </Menu.Item> */}
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const loadMoreProps = {
      loadedAll: loadedAllNotices,
      loading: fetchingMoreNotices,
    };
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);

    return (
      <div className={styles.right}>
        {currentUser.userName ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
                <div style={{}}>
                  <Icon type="user" className={styles.iconHeader} style={{}} />
                  <span className={styles.name}>{currentUser.userName}</span>
                  <Icon type="down" className={styles.iconDown} style={{color: '#ffffff' }}/>
                </div>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}

export default RightContent;
