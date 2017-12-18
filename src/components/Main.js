require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//将图片url添加进imageData中
//通过配置webpack的json-loader实现require加载json文件，同步加载
let jsondata = require('../data/imageData.json');

let imageDatas = (function (imageDatas) {

  for (let i in imageDatas) {
    imageDatas[i].imageUrl = '../images/' + imageDatas[i].fileName
  }
  return imageDatas;

})(jsondata);

class ImgFigure extends React.Component {

  render() {

    return (
      <figure className='img-figure' id={this.props.id}  style={this.props.arrange.pos}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className='img-title'>{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

class GalleryByReact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [],
      Constant: {
        centerPos: {
          left: 0,
          right: 0
        },
        hPosRange: { //水平方向取值范围
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: { //垂直方向取值范围
          x: [0, 0],
          topY: [0, 0]
        }
      },
      a:1
    }

  }

  /*
  * 重新布局所有图片
  * @param centerIndex 指定居中排布哪个图片
  * */
  rearrange(centerIndex) {
    //console.log(this.state.Constant.centerPos.left);
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.state.Constant,
      centerPos = Constant.centerPos, //中心图片坐标
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX, //左块X范围
      hPosRangeRightSecX = hPosRange.rightSecX, //右块X范围
      hPosRangeY = hPosRange.y, //左右块Y范围
      vPosRangeTopY = vPosRange.topY, //上块Y范围
      vPosRangeX = vPosRange.x, //上块X范围

      imgsArrangeTopArr = [], //上块图片信息，0张或1张图片信息
      topImgNum = Math.floor(Math.random() * 2), //0或1
      topImgSpliceIndex = 0, //上块图片从哪个位置开始拿

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1); //从imgsArrangeArr中剔除centerIndex的图片信息
    //居中centerIndex图片
    imgsArrangeCenterArr[0].pos = centerPos;
    //取出要布局的上块的信息
    //在取值范围内取随机一个
    topImgSpliceIndex = Math.floor(Math.random() * imgsArrangeArr.length - topImgNum);
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum); //从imgsArrangeArr中剔除topImgSpliceIndex的图片信息

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index].pos = {
        top: GalleryByReact.randomPos(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: GalleryByReact.randomPos(vPosRangeX[0], vPosRangeX[1])
      }
    });

    //布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i].pos = {
        left: GalleryByReact.randomPos(hPosRangeLORX[0], hPosRangeLORX[1]),
        top: GalleryByReact.randomPos(hPosRangeY[0], hPosRangeY[1])
      }
    }

    //如果上块有一张图片，则把这张图片重新塞回imgsArrangeArr
    if (imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }

    //塞回中间一张图片
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })

  }

  //渲染完成后调用一次，这个时候DOM结构已经渲染了
  componentDidMount() {

    //拿到舞台大小
    let stageDOM = this.refs.stage,
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.floor(stageW / 2),
      halfStageH = Math.floor(stageH / 2);

    //拿到一个imgFigureDOM
    let imgFigureDOM = document.getElementById('imgFigure0'),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.floor(imgW / 2),
      halfImgH = Math.floor(imgH / 2);

    console.log(imgW);
    //计算中心图片的位置点
    this.state.Constant.centerPos = {

      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算左侧右侧图片排布取值范围
    this.state.Constant.hPosRange = {
      leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
      rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
      y: [-halfImgH, stageH - halfImgH]
    };

    //计算上方图片排布取值范围
    this.state.Constant.vPosRange = {
      x: [halfImgW - imgW],
      topY: [halfImgH, stageH - halfImgH * 3]
    };
    //console.log(this.state.Constant.centerPos.left);
    this.rearrange(0);

  }

  render() {

    let controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }

      imgFigures.push(<ImgFigure data={value} id={'imgFigure' + index} key={index}
                                 arrange={this.state.imgsArrangeArr[index]}/>)
    });

    return (
      <section className='stage' ref='stage'>
        <section className='img-sec'>
          {imgFigures}
        </section>
        <nav className='controller-nav'>
          {controllerUnits}
        </nav>
      </section>
    );
  }
}


/*
* static method，用于返回区间内的一个随机值
* @param low,high
* */
GalleryByReact.randomPos = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low)
};


GalleryByReact.defaultProps = {};

export default GalleryByReact;
