import React, { PureComponent } from 'react';
import QRCode from 'qrcode.react'
import styles from './index.less'

import qrCenter from './../../assets/qr-center.jpg';
import qrBottom from "./../../assets/qr-bottom.jpg";


export default class QRCard extends PureComponent {

  render() {
    const { deviceId,position,deviceName,regionId,regionName,location,floorId } = this.props.item

    if (this.props.item.deviceId) {
      return (
        <div id={this.props.item.deviceId} className={styles.box}>
          <div style={{position:'relative', marginTop: 20}}>
            <QRCode value={deviceId} size={280} level="H" />
            <img style={{ width: 80,position: 'absolute',top: '50%',left: '50%',marginTop: -40,marginLeft: -40}} src={qrCenter} alt="LOGO" />
          </div>
          <div style={{color: '#000',fontWeight: 'bold'}}>{deviceName}</div>
          <div style={{color: '#000',fontWeight: 'bold'}}>{position}</div>
          <img style={{ width: 280}} src={qrBottom} alt="LOGO" />
        </div>
      )
    } else if (this.props.item.regionId) {
      return (
        <div id={this.props.item.regionId} className={styles.box}>
          <div style={{position:'relative', marginTop: 20}}>
            <QRCode value={regionId} size={280} level="H" />
            <img style={{ width: 100,position: 'absolute',top: '50%',left: '50%',marginTop: -50,marginLeft: -50}} src={qrCenter} alt="LOGO" />
          </div>
          <div style={{color: '#000',fontWeight: 'bold'}}>{regionName}</div>
          <div style={{color: '#000',fontWeight: 'bold'}}>{position}</div>
          <img style={{ width: 280}} src={qrBottom} alt="LOGO" />
        </div>
      )
    } else if (this.props.item.floorId) {
      return (
        <div id={this.props.item.floorId} className={styles.box}>
          <div style={{position:'relative', marginTop: 20}}>
            <QRCode value={floorId} size={280} level="H" />
            <img style={{ width: 100,position: 'absolute',top: '50%',left: '50%',marginTop: -50,marginLeft: -50}} src={qrCenter} alt="LOGO" />
          </div>
          <div style={{color: '#000',fontWeight: 'bold'}}>{location}</div>
          <img style={{ width: 280}} src={qrBottom} alt="LOGO" />
        </div>
      )
    }
  }
}
