/** 
 * 输入框自定义指令
 * 在main.js中引入并use
 * import inputTypes from './directive/inputTypes'
 * Vue.use(inputTypes);
 */

// 寻找第一个type类型元素
let findEle = (el, type) => {
  // el-input的input外层包着一层div，el是div
  return el.nodeName.toLowerCase() === type ? el: el.querySelector(type);
};

const phoneOnly = {
  bind: function(el, binding, vnode) {
    let inputE = findEle(el, "input");
    el.inputE = inputE;
    inputE.handler = function() {
      if (inputE.value) {
        inputE.value = inputE.value.replace(/\D+/, '');
        // 改变虚拟节点上v-model的值，避免v-model值未更改
        if (vnode && vnode.data && vnode.data.model) {
          vnode.data.model.callback(inputE.value);
        }
      }
    }
    inputE.addEventListener('input', inputE.handler);
  },
  unbind: function(el) {
    el.inputE.removeEventListener('input', el.inputE.handler);
  }
}

const numberOnly = {
  bind: function(el, {value = 2, modifiers}, vnode) {
    let inputE = findEle(el, "input");
    let regStr = value == 0 ? `^[\\-]?\\d+` : `^[\\-]?\\d+\\.?\\d{0,${value}}`;
    el.inputE = inputE;
    inputE.handler = function() {
      if (inputE.value != "-") {
        inputE.value = inputE.value.match(new RegExp(regStr, "g"));
        if (modifiers.positive) {
          inputE.value = inputE.value.replace("-", "");
        }
        // 改变虚拟节点上v-model的值，避免v-model值未更改
        if (vnode && vnode.data && vnode.data.model) {
          vnode.data.model.callback(inputE.value);
        }
      } else {
        if (modifiers.positive) {
          inputE.value = "";
          // 改变虚拟节点上v-model的值，避免v-model值未更改
          if (vnode && vnode.data && vnode.data.model) {
            vnode.data.model.callback(inputE.value);
          }
        }
      }
    }
    inputE.blurEvent = function() {
      if (modifiers.fill && value > 0) {
        if (inputE.value != "-") {
          // 手动计算补零
          // let numStr = inputE.value.toString();
          // let pointIndex = numStr.indexOf('.');
          // if (pointIndex < 0 ) {
          //   numStr += ("." + "0".repeat(value));
          // } else {
          //   // 需补充0的位数(补充几个0)
          //   let n = (value - (numStr.length - 1 - pointIndex)); 
          //   if (n > 0) {
          //     numStr += "0".repeat(n);
          //   }
          // }

          inputE.value = parseFloat(inputE.value).toFixed(value);
        } else {
          inputE.value = "0." + "0".repeat(value);
        }
        if (isNaN(parseFloat(inputE.value).toFixed(value))) {
          inputE.value = "";
        } else {
          inputE.value = parseFloat(inputE.value).toFixed(value);
        }
        // 改变虚拟节点上v-model的值，避免v-model值未更改
        if (vnode && vnode.data && vnode.data.model) {
          vnode.data.model.callback(inputE.value);
        }
      }
    }
    inputE.addEventListener('input', inputE.handler);
    inputE.addEventListener("blur", inputE.blurEvent);
  },
  unbind: function(el) {
    el.inputE.removeEventListener('input', el.inputE.handler);
    el.inputE.removeEventListener('blur', el.inputE.blurEvent);
  }
};

// 全角转半角
const angle = {
  inserted(el, binding, vnode) {
    el.children[0].value = binding.value || ''
    let angleValue = el.children[0]
    el.addEventListener('keyup', function (e) {
      e = e || window.event
      let str = angleValue.value
      let tmp = ''
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) === 12288) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
          continue
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
        } else {
          tmp += String.fromCharCode(str.charCodeAt(i))
        }
      }
      vnode.data.model.callback(tmp)
    })
  }
};


const inputTypes = {
  phoneOnly,
  numberOnly,
  angle
}
 
const inputTypesInstall = {
  install(Vue) {
    Object.keys(inputTypes).forEach((key) => {
      Vue.directive(key, inputTypes[key])
    })
  }
}

export default inputTypesInstall;