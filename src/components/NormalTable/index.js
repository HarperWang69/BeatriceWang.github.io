import React, {PureComponent} from 'react';
import {Table} from 'antd';
import styles from './index.less';


class NormalTable extends PureComponent {

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  handleTableRowClick = (record) => {
    return {
      onClick: () => {
        if (this.props.onRowClick) {
          this.props.onRowClick(record);
        }
      },
    };
  };

  render() {
    const {data: {list, pagination}, loading, columns, rowKey,rowSelection} = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };


    return (
      <div className={styles.standardTable}>
        <Table
          {...this.props}
          rowSelection={rowSelection || null}
          loading={loading}
          rowKey={rowKey || ((text,index) => index)}
          dataSource={list}
          columns={columns}
          size='middle'
          bordered
          pagination={pagination? paginationProps : false}
          onChange={this.handleTableChange}
          onRow={this.handleTableRowClick}
        />
      </div>
    );
  }
}

export default NormalTable;
