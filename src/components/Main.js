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


class GalleryByReact extends React.Component {
  render() {
    return (
     <section className='stage'>
       <section className='img-sec'>
         <nav className='controller-nav'>

         </nav>
       </section>
     </section>
    );
  }
}

GalleryByReact.defaultProps = {};

export default GalleryByReact;
