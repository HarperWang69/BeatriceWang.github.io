import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const links = [
  // {
  //   key: 'help',
  //   title: 帮助,
  //   href: '',
  // },
  // {
  //   key: 'privacy',
  //   title: 隐私,
  //   href: '',
  // },
  // {
  //   key: 'terms',
  //   title: 条款,
  //   href: '',
  // },
];

const copyright = (
  <Fragment>
    <span className={styles.loginFooter}>
      <img></img>
    </span>
  </Fragment>
);

class UserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>

            </div>
          </div>
          {children}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
