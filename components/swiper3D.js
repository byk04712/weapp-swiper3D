const ICON_ARROW = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACaklEQVR4Xu3azU3DMBgGYH/qMZXoBuRYyZYYgTIB3YAyAbBBmQCYoN0A2AA2CFKi9kZGAKm+tTUyIihAG//EsYnjXhO1eh+//klUQB3/QMfzowAQGtBxgTAFOl6AsAiGKRCmQMcFwhToeAHCLuBsCsRxPIii6BQABuv1+nG5XOYu2ugEgBAyQgjdI4QGpdDTNE2vbSNYB8AYTwBgtisoY2yeZdm5TQSrAFXhi9C2EawByIR3gWAFQCW8bYTGAXTC20RoFKBOeFsIjQFIhn9njOUAcFS18je5MDYCoBB+RCnNoyh6coVgHEAlfJZlCR/5r1OhEwSjADrhi+q7QjAGUCe8SwQjACbCu0KoDWAyvAuEWgBNhLeNoA3QZHgdBErpVZ7nb6pPkloANsJrICSU0hNVBGUAm+FtICgBuAhfRuj3+w8IoWPBsVmpCdIAhJALhNCtYI7xs/2oOOGpzkeZ+zHGcwA4M4UgBYAxngHAxHX44vdNIggB/lt40wiVADLhGWMvlNKR6uorU3fRPSaasBfgv4c31YSdAG0JbwLhD0DbwtdF+AHQ1vB1EL4B2h5eF+ETwJfwOgiAMb4EgBvBycrZVifaCvddl9kit9vtHQd4BYB43xe53Od1w8s2gTGWACGEP0Mf7PqxNoeXRHjmDXgAgNPfAD6EFyEwxq5gOBzGvV6Pv5M/LCE8r1arsYvjbd3aV6wJfK2bltp+nabp9HMX+HonP+ZrwWazSRaLBX/u9vLDB7z8dxzh06CXCqVQAcD3ERblCw0QCfl+PTTA9xEW5QsNEAn5fj00wPcRFuULDRAJ+X698w34AEIRVGJheVmoAAAAAElFTkSuQmCC`;
let startX = 0, startY = 0;

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
    // 是否始终正立
    // stand: {
    //   type: Boolean,
    //   value: false
    // }
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
          console.log('touchstart', startX, startY);
          break;
        case 'touchmove':
          let touchmove = e.touches[0];
          let moveX = touchmove.pageX - startX;
          let moveY = touchmove.pageY - startY;
          console.log('moved X ' + moveX + ' Y ' + moveY, self.data.direction);
          // self.setData({
          //   rotateX: self.data.rotateX - moveY,
          //   rotateY: self.data.rotateY + moveX
          // }, function() {
          //   [startX, startY] = [touchmove.pageX, touchmove.pageY];
          // });
          break;
        case 'touchend':
        case 'touchcancel':
          let { pageX: endX, pageY: endY } = e.changedTouches[0];
          // console.log('touchend or touchcancel', endX, endY);
          let movedX = startX - endX;
          let movedY = startY - endY;

          // scroll horizontal
          if (Math.abs(movedX) > Math.abs(movedY)) {
            // right 2 left
            if (movedX > 0) {
              let rotate = Math.round(Math.abs(movedX) / 90);
              console.log('right 2 left', self.data.rotateY - rotate * 90);
              self.setData({
                rotateY: self.data.rotateY - rotate * 90
              });
            }
            // left 2 right
            else if (movedX < 0) {
              let rotate = Math.round(Math.abs(movedX) / 90);
              console.log('left 2 right', self.data.rotateY + rotate * 90);
              self.setData({
                rotateY: self.data.rotateY + rotate * 90
              });
            }
          }
          // scroll vertical
          else if (Math.abs(movedX) < Math.abs(movedY)) {
            // bottom 2 top
            if (movedY > 0) {
              let rotate = Math.round(Math.abs(movedY) / 90);
              console.log('bottom 2 top', self.data.rotateX + rotate * 90);
              self.setData({
                rotateX: self.data.rotateX + rotate * 90
              });
            }
            // top 2 bottom
            else if (movedY < 0) {
              let rotate = Math.round(Math.abs(movedY) / 90);
              console.log('top 2 bottom', self.data.rotateX - rotate * 90);
              self.setData({
                rotateX: self.data.rotateX - rotate * 90
              });
            }
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
