const ICON_ARROW = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACaklEQVR4Xu3azU3DMBgGYH/qMZXoBuRYyZYYgTIB3YAyAbBBmQCYoN0A2AA2CFKi9kZGAKm+tTUyIihAG//EsYnjXhO1eh+//klUQB3/QMfzowAQGtBxgTAFOl6AsAiGKRCmQMcFwhToeAHCLuBsCsRxPIii6BQABuv1+nG5XOYu2ugEgBAyQgjdI4QGpdDTNE2vbSNYB8AYTwBgtisoY2yeZdm5TQSrAFXhi9C2EawByIR3gWAFQCW8bYTGAXTC20RoFKBOeFsIjQFIhn9njOUAcFS18je5MDYCoBB+RCnNoyh6coVgHEAlfJZlCR/5r1OhEwSjADrhi+q7QjAGUCe8SwQjACbCu0KoDWAyvAuEWgBNhLeNoA3QZHgdBErpVZ7nb6pPkloANsJrICSU0hNVBGUAm+FtICgBuAhfRuj3+w8IoWPBsVmpCdIAhJALhNCtYI7xs/2oOOGpzkeZ+zHGcwA4M4UgBYAxngHAxHX44vdNIggB/lt40wiVADLhGWMvlNKR6uorU3fRPSaasBfgv4c31YSdAG0JbwLhD0DbwtdF+AHQ1vB1EL4B2h5eF+ETwJfwOgiAMb4EgBvBycrZVifaCvddl9kit9vtHQd4BYB43xe53Od1w8s2gTGWACGEP0Mf7PqxNoeXRHjmDXgAgNPfAD6EFyEwxq5gOBzGvV6Pv5M/LCE8r1arsYvjbd3aV6wJfK2bltp+nabp9HMX+HonP+ZrwWazSRaLBX/u9vLDB7z8dxzh06CXCqVQAcD3ERblCw0QCfl+PTTA9xEW5QsNEAn5fj00wPcRFuULDRAJ+X698w34AEIRVGJheVmoAAAAAElFTkSuQmCC`;
let startX = 0, startY = 0, lastX = 0, lastY = 0;

Component({
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  // 组件间关系
  relations: {
    './swiper3D-side': {
      type: 'child', // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        console.log('[swiper3d] a child is linked: ', target)
      },
      linkChanged: function (target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
        console.log('[swiper3d] a child is linkChanged: ', target)
      },
      unlinked: function (target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
        console.log('[swiper3d] a child is unlinked: ', target)
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    direction: {
      type: String,
      value: 'all',
      observer: function (newVal, oldVal) {
        if (['x', 'y', 'all'].indexOf(newVal) === -1) {
          throw new Error('proerty direction must be x,y or all');
        }
      }
    },
    // 是否显示上下左右滑动箭头
    arrow: {
      type: Boolean,
      value: true
    },
    // 宽
    width: {
      type: String,
      value: '100vw'
    },
    // 高
    height: {
      type: String,
      value: '750rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rotateX: 0,
    rotateY: 0,
    iconArrow: ICON_ARROW
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTouch: function (e) {
      let self = this;
      switch (e.type) {
        case 'touchstart':
          let touchstart = e.touches[0];
          [startX, startY] = [touchstart.pageX, touchstart.pageY];
          [lastX, lastY] = [startX, startY];
          break;
        case 'touchmove':
          let touchmove = e.touches[0];
          let moveX = touchmove.pageX - lastX;
          let moveY = touchmove.pageY - lastY;

          if ('x' === self.data.direction) {
            self.setData({
              rotateY: self.data.rotateY + moveX
            }, function () {
              lastX = touchmove.pageX;
            });
          } else if ('y' === self.data.direction) {
            self.setData({
              rotateX: self.data.rotateX - moveY
            }, function () {
              lastY = touchmove.pageY;
            });
          } else if ('all' === self.data.direction) {
            self.setData({
              rotateX: self.data.rotateX - moveY,
              rotateY: self.data.rotateY + moveX
            }, function () {
              [lastX, lastY] = [touchmove.pageX, touchmove.pageY];
            });
          }
          break;
        case 'touchend':
        case 'touchcancel':
          let { pageX: endX, pageY: endY } = e.changedTouches[0];
          let movedX = startX - endX;
          let movedY = startY - endY;

          // scroll horizontal
          if ('x' === self.data.direction) {
            let ratioY = Math.round(self.data.rotateY / 90);
            self.setData({
              rotateY: ratioY * 90
            });
          }
          // scroll vertical
          else if ('y' === self.data.direction) {
            let ratioX = Math.round(self.data.rotateX / 90);
            self.setData({
              rotateX: ratioX * 90
            });
          }
          // scroll all
          else if ('all' === self.data.direction) {
            let ratioX = Math.round(self.data.rotateX / 90);
            let ratioY = Math.round(self.data.rotateY / 90);
            self.setData({
              rotateX: ratioX * 90,
              rotateY: ratioY * 90
            });
          }
          break;
      }
    },
    onArrowLeft: function (e) {
      this.data.rotateY -= 90;
      this.setData({
        rotateY: this.data.rotateY
      });
    },
    onArrowRight: function (e) {
      this.data.rotateY += 90;
      this.setData({
        rotateY: this.data.rotateY
      });
    },
    onArrowTop: function (e) {
      this.data.rotateX -= 90;
      this.setData({
        rotateX: this.data.rotateX
      });
    },
    onArrowBottom: function (e) {
      this.data.rotateX += 90;
      this.setData({
        rotateX: this.data.rotateX
      });
    }
  }
})
