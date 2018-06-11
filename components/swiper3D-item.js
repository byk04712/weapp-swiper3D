// pages/components/swiper3D-side.js
Component({
  externalClasses: ['my-class'],
  // 组件间关系
  relations: {
    './swiper3D': {
      type: 'parent', // 关联的目标节点应为父节点
      linked: function (target) {
        // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
        console.log('[swiper3d-side] a parent is linked: ', target)
      },
      linkChanged: function (target) {
        // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
        console.log('[swiper3d-side] a parent is linkChanged: ', target)
      },
      unlinked: function (target) {
        // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
        console.log('[swiper3d-side] a parent is unlinked: ', target)
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 可选值 front，back，left，right，top，bottom 分别代表3d盒子模型的 前后左右上下 面
     */
    side: {
      type: String,
      value: 'front',
      observer: function (newVal, oldVal) {
        console.log('property side ', newVal, oldVal);
        if (['front', 'back', 'left', 'right', 'top', 'bottom'].indexOf(newVal) === -1) {
          throw new Error('property side must be front, back, left, right, top or bottom');
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
