
let _items, i;

const { guideMask, guideFocus } = generateGuideEl();

document.body.appendChild(guideMask);

document.body.appendChild(guideFocus);

export function stopGuide() {
  unbindGlobalEvent();
  hiddenGuide();
}

export function destoryGuide() {
  unbindGlobalEvent();
}

export default function guide(
  items,
  padding = { top: 10, right: 10, bottom: 10, left: 10 }
) {

  _items = items,
    i = 0;
  _items.forEach(item => {
    item.padding = Object.assign({}, padding, item.padding);
  })

  Object.assign(guideMask.style, getContainerSize());

  guideStep();

  showGuide();

}

//生成guide组件的element元素
function generateGuideEl() {
  let guideMask = document.createElement("div");
  guideMask.classList.add("guide-mask");
  guideMask.classList.add("guide-hidden");
  let guideFocus = document.createElement("div");
  guideFocus.classList.add("guide-focus");
  guideFocus.classList.add("guide-hidden");
  return {
    guideMask,
    guideFocus
  }
}
//视觉定位到匹配元素
function fixed(el) {
  el.tabIndex = "0";
  el.focus();
  delete el.tabIndex;
  el.blur();
}

//获取当前视窗的滚动尺寸
function getContainerSize() {
  let body = document.body,
    style = window.getComputedStyle(body);
  return {
    width: transform(style.marginLeft) + transform(style.borderLeftWidth) + transform(style.paddingLeft) + body.scrollWidth + transform(style.marginRight) + transform(style.borderRightWidth) + transform(style.paddingRight),
    height: transform(style.marginTop) + transform(style.borderTopWidth) + transform(style.paddingTop) + body.scrollHeight + transform(style.paddingBottom) + transform(style.borderBottomWidth) + transform(style.marginBottom)
  }
  function transform(value) {
    return parseFloat(value) || 0
  }
}

function getAllPoint(el, padding) {

  const rect = el.getBoundingClientRect(),
    focusPosition = {
      top: el.offsetTop - padding.top,
      left: el.offsetLeft - padding.left,
      width: rect.width + (padding.left + padding.right),
      height: rect.height + (padding.top + padding.bottom)
    },
    center = {
      left: el.offsetLeft + rect.width / 2,
      top: el.offsetTop + rect.height / 2
    },
    topCenter = {
      left: center.left,
      top: focusPosition.top
    },
    rightCenter = {
      left: focusPosition.left + focusPosition.width,
      top: center.top
    },
    bottomCenter = {
      left: center.left,
      top: focusPosition.top + focusPosition.height
    },
    leftCenter = {
      left: focusPosition.left,
      top: center.top
    };
  return { focusPosition, center, topCenter, rightCenter, bottomCenter, leftCenter }
}

function showGuide() {
  document.documentElement.classList.add("guide-overflow-hidden");
  guideMask.classList.remove("guide-hidden");
  guideFocus.classList.remove("guide-hidden");
}

function hiddenGuide() {
  document.documentElement.classList.remove("guide-overflow-hidden");
  guideMask.classList.add("guide-hidden");
  guideFocus.classList.add("guide-hidden");
}

function bindGlobalEvent(){
  if (!window.__guide) {
    window.__guide = true;
    window.addEventListener("keydown", globalEvent);
    window.addEventListener("click", globalEvent);
  }
}

function unbindGlobalEvent(){
  delete window.__guide;
  window.removeEventListener("keydown", globalEvent);
  window.removeEventListener("click", globalEvent);
}

function globalEvent(event) {
  if(event.type==="keydown"&&event.keyCode===37){
    i--;
  }else{
    i++;
  }
  guideStep();
}

function guideStep() {
  if (i >= _items.length) {
    fixed(_items[0].el);
    stopGuide();
    return;
  }else if(i<0){
    i=0;
    return;
  }
  const item = _items[i],
    { el, padding, extraRender } = item;

  fixed(el);

  const allPoint = getAllPoint(el, padding);

  Object.assign(guideFocus.style, allPoint.focusPosition);

  if (extraRender) {
    unbindGlobalEvent();
    const promise = new Promise((res) => {
      extraRender({ next: res,stopGuide,el, guideMask, guideFocus, ...allPoint })
    });

    promise.then(function (increment) {
      if(!increment){
        bindGlobalEvent();
      }else{
        i += increment;
        guideStep();
      }
    })
  } else {
    bindGlobalEvent();
  }
}