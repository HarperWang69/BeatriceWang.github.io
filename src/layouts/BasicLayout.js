import React from 'react';
import { Layout, LocaleProvider, Modal, Form, Icon, Carousel, Badge } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import { ContainerQuery } from 'react-container-query';
import SiderMenu from '@/components/SiderMenu';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';
import Exception403 from '../pages/Exception/403';
import logo from '../assets/logo.svg';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import Footer from './Footer';
import Header from './Header';

import zhCN from 'antd/lib/locale-provider/zh_CN';
import styles from './BasicLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

// const CreateForm = Form.create()(props => {
//   const { _this,MessageList } = props;
//   const { modalVisible } = _this.state;

//   const lunboSetting = {
//     dots: true,
//     lazyLoad: true,
//     autoplay:true,
//   }
//   console.log(MessageList && MessageList.messageText && MessageList.messageText.message)
//   // const MessageFuck = MessageList.messageText.message ? MessageList.list.messageText.message :''
//   return (
//     <Modal
//       className={styles.messageModal}
//       visible={modalVisible}
//       mask={false}
//       footer={null}
//       zIndex={0}
//       width={350}
//       style={{ top: 800,left:800}}
//       maskClosable={false}
//       onCancel={() => _this.closeModalVisible()}
//     >
//       <div className={styles.carousel}>
//         <div className={styles.messageHead}>
//           <span>最近消息</span>
//           <Badge style={{height:'17px',marginLeft:'15px'}} count={25} />
//         </div>
//         <Carousel {...lunboSetting} ref={el => (_this.slider = el)}>
//           <div key={1} className={styles.messageContent} onClick={_this.toMessage}>
//             <div>{MessageList && MessageList.messageText && MessageList.messageText.message}</div>
//             <div>即将过期</div>
//             <div>2019-02-27 10:34:02</div>
//           </div>
//         </Carousel>
//         <hr style={{color:'#409EFF'}}/>
//         <div style={{height:'30px'}}>
//           <Icon type="left-circle" className={styles.jumpLeft} onClick={_this.prev}/>
//           <div className={styles.jumpPage}>6/36</div>
//           <Icon type="right-circle" className={styles.jumpRight} onClick={_this.next}/>
//         </div>
//       </div>
//     </Modal>
//   );
// });

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }
  next() {
    this.slider.slick.slickNext();
  }
  prev() {
    this.slider.slick.slickPrev();
  }

  state = {
    modalVisible: false,
    myMessages: '',
  };
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    const router = this.props.location.pathname;
    // this.getSiteMessage()
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
    dispatch({
      type: 'user/fetchCurrent',
    });
    // if(router !== "/systemManage/manage/messageManage"){
    //   this.setState({
    //     modalVisible: true,
    //   });
    // }
  }

  // toMessage=()=>{
  //   const { dispatch } = this.props;
  //   dispatch(routerRedux.push('/systemManage/manage/messageManage'));
  //   this.setState({
  //     modalVisible: false,
  //   });
  // }

  // //获取未读的站内消息
  // getSiteMessage =()=>{
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type:'messageManage/MessageList',
  //     payload:{
  //       time: 0,
  //       state: 2,
  //       type: 0,
  //       ticket: '',
  //       pageNum: 1,
  //       pageSize: 10
  //     },callback: response => {
  //       console.log(response)
  //     }
  //   })
  // }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  closeModalVisible = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.forEach(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  render() {
    const {
      navTheme,
      children,
      layout: PropsLayout,
      location: { pathname },
      isMobile,
      fixedHeader,
      route: { routes },
      menuData,
      MessageList,
    } = this.props;
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 20 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu logo={logo} menuData={menuData} theme={navTheme} {...this.props} />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            <Authorized authority={routerConfig} noMatch={<Exception403 />}>
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
        {/* <CreateForm _this={this} MessageList={MessageList}/> */}
      </React.Fragment>
    );
  }
}

export default connect(({ messageManage, global, menu, setting }) => ({
  // MessageList:messageManage.MessageList.list,
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  ...setting,
}))(props => (
  <LocaleProvider locale={zhCN}>
    <Media query="(max-width: 599px)">
      {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
    </Media>
  </LocaleProvider>
));
