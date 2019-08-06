import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { Icon, Tabs, Badge, Spin } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
  static Tab = TabPane;

  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    loading: false,
    clearClose: false,
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };

  state = {
    visible: false,
  };
  handleVisibleChange = visible => {
    const { onPopupVisibleChange } = this.props;
    this.setState({ visible });
    onPopupVisibleChange(visible);
  };

  onLoadMore = (tabProps, event) => {
    const { onLoadMore } = this.props;
    onLoadMore(tabProps, event);
  };

  onClear = name => {
    const { onClear, clearClose } = this.props;
    onClear(name);
    if (clearClose) {
      this.popover.click();
    }
  };

  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    const { clickClose } = item;
    onItemClick(item, tabProps);
    if (clickClose) {
      this.popover.click();
    }
  };

  onTabChange = tabType => {
    const { onTabChange } = this.props;
    onTabChange(tabType);
  };
  
  getNotificationBox() {
    const { children, loading } = this.props;
    const { visible } = this.state;
    if (!children) {
      return null;
    }

    const panes = React.Children.map(children, child => {
      const {
        list,
        title,
        name,
        count,
        emptyText,
        emptyImage,
        showClear,
        loadedAll,
        scrollToLoad,
        loading: tabLoading,
      } = child.props;
      const len = list && list.length ? list.length : 0;

      const msgCount = count || count === 0 ? count : len;

      const tabTitle = msgCount > 0 ? `${title} (${msgCount})` : title;

      return (
        <TabPane tab={tabTitle} key={name}>
          <List
            data={list}
            emptyImage={emptyImage}
            emptyText={emptyText}
            loadedAll={loadedAll}
            loading={tabLoading}
            onClear={() => this.onClear(name)}
            onClick={item => this.onItemClick(item, child.props)}
            onLoadMore={event => this.onLoadMore(child.props, event)}
            scrollToLoad={scrollToLoad}
            showClear={showClear}
            title={title}
            visible={visible}
          />
        </TabPane>
      );
    });
    return (
      <Fragment>
        <Spin spinning={loading} delay={0}>
          <Tabs className={styles.tabs} onChange={this.onTabChange}>
            {panes}
          </Tabs>
        </Spin>
      </Fragment>
    );
  }

  render() {
    const { className, count, popupVisible } = this.props;
    const { visible } = this.state;
    const notificationBox = this.getNotificationBox();
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const trigger = (
      <span className={classNames(noticeButtonClass, { opened: visible })}>
        <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
          <Icon type="bell" className={styles.icon} />
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = popupVisible;
    }
    return (
      <HeaderDropdown
        placement="bottomRight"
        overlay={notificationBox}
        overlayClassName={styles.popover}
        trigger={['click']}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        {...popoverProps}
        ref={node => (this.popover = ReactDOM.findDOMNode(node))} // eslint-disable-line
      >
        {trigger}
      </HeaderDropdown>
    );
  }
}
