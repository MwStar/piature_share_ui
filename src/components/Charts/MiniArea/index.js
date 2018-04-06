/*
*   折线图配置：
*   data: 为图形数据源，格式为数组，
*         数据传入以type分类区分数据类型以及折线条数,且type显示为tooltips的key值
*   seriseDate: chartType传入线形图格式，传入line为折线图，不传或其他为lineArea
          sideTitle为y轴信息以及tooltips title显示信息，
* 
*/


import React, { PureComponent } from 'react';
import G2 from 'g2';
import equal from '../equal';
import styles from '../index.less';

class MiniArea extends PureComponent {
  static defaultProps = {
    borderColor: '#1890FF',
    color: 'rgba(24, 144, 255, 0.2)',
  };

  componentDidMount() {
    const { data, sideTitle, timeType } = this.props;
    this.renderChart(data, sideTitle, timeType);
  }

  componentWillReceiveProps(nextProps) {
    if (!equal(this.props, nextProps)) {
      this.renderChart(nextProps.data, nextProps.sideTitle, nextProps.timeType);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  handleRef = (n) => {
    this.node = n;
  }

  renderChart(data, sideTitle, timeType) {
    const {
      height = 0, fit = true, color, borderWidth = 2, xAxis, yAxis, animate = true,
    } = this.props;
    const borderColor = this.props.borderColor || color;
    // const date = new Date(data);
    // const mon = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    // const day = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    // const ymd = `${date.getFullYear()}-${mon[date.getMonth()]}-${day[date.getDate()]}`;
    if (!data || (data && data.length < 1)) {
      return;
    }

    // clean
    this.node.innerHTML = '';

    const chart = new G2.Chart({
      container: this.node,
      forceFit: fit,
      height,
      animate,
      // padding: [36, 200, 80, 100],
      plotCfg: { // 配置charts样式
        background: {
          fill: '#FFFFFF',
        },
        margin: [36, 140, 80, 100],
      },
    });

    if (!xAxis && !yAxis) {
      chart.axis(true);
    }

    if (xAxis) {
      chart.axis('x', xAxis);
    } else {
      chart.axis('x', true);
    }

    if (yAxis) {
      chart.axis('y', yAxis);
    } else {
      chart.axis('y', true);
    }

    const dataConfig = {
      x: {
        type: 'timeCat',
        mask: timeType, // yy-mm-dd HH:MM
        tickCount: 6,
        alias: ' ',
        // values: [`${ymd} 00:00`, `${ymd} 02:00`, `${ymd} 04:00`, `${ymd} 06:00`,`${ymd} 08:00`, `${ymd} 10:00`, `${ymd} 11:00`, `${ymd} 12:00`,`${ymd} 14:00`, `${ymd} 16:00`,`${ymd} 18:00`,`${ymd} 20:00`, `${ymd} 22:00`,`${ymd} 24:00`]
      },
      y: {
        min: 0,
        alias: sideTitle, // 侧边说明信息
      },
    };

    chart.tooltip({
      crosshairs: true,
      map: {
        name: data.type,
        value: 'y',
      },
    });

    chart.legend({
      title: '',
      autoWrap: true,
      position: 'right', // 设置图例的显示位置
      itemGap: 20, // 图例项之间的间距
      // marker: 'square', // 设置图例 marker 的显示样式
    });


    const view = chart.createView();
    view.source(data, dataConfig);


    view.line().position('x*y').color('type', ['#1f77b4', '#ff7f0e', '#2ca02c']).size(borderWidth)
      .shape('smooth');
    chart.render();

    this.chart = chart;
  }

  render() {
    const { height } = this.props;

    return (
      <div className={styles.miniChart} style={{ height }}>
        <div className={styles.chartContent}>
          <div ref={this.handleRef} />
        </div>
      </div>
    );
  }
}

export default MiniArea;
