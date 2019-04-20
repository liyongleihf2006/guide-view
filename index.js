import guide from "./guide.js";
let test1 = document.querySelector("#test1");
let test2 = document.querySelector("#test2");
let test3 = document.querySelector("#test3");
let test4 = document.querySelector("#test4");
let padding = { top: 5, right: 10, bottom: 5, left: 10 };
let
  firstStepPanel,
  secondStepPanel;
let items = [{
  el: test1,
  extraRender: ({ next, stopGuide, el, guideMask, guideFocus, focusPosition, center, topCenter, rightCenter, bottomCenter, leftCenter }) => {
    firstStepPanel = document.createElement("span");
    firstStepPanel.textContent = "鼠标左键或任意按键进入下一步";
    Object.assign(firstStepPanel.style, bottomCenter, {
      position: "absolute",
      left: bottomCenter.left - 200
    });
    guideMask.appendChild(firstStepPanel);
    next();
  }
}, {
  el: test2,
  extraRender: ({ next, stopGuide, el, guideMask, guideFocus, focusPosition, center, topCenter, rightCenter, bottomCenter, leftCenter }) => {
    guideMask.contains(firstStepPanel)&&guideMask.removeChild(firstStepPanel);
    secondStepPanel = document.createElement("div");
    Object.assign(secondStepPanel.style, leftCenter, {
      position: "absolute",
      left: leftCenter.left - 200
    });
    guideMask.appendChild(secondStepPanel);
    const back = document.createElement("button");
    back.textContent = "返回";
    back.addEventListener("click", function (e) {
      e.stopPropagation();
      next(-1);
    });
    secondStepPanel.appendChild(back);
    const forward = document.createElement("button");
    forward.textContent = "前进";
    forward.addEventListener("click", function (e) {
      e.stopPropagation();
      next(1);
    })
    secondStepPanel.appendChild(forward);
    const stop = document.createElement("button");
    stop.textContent = "停止";
    stop.addEventListener("click", function (e) {
      e.stopPropagation();
      stopGuide();
    })
    secondStepPanel.appendChild(stop)
  }
}, {
  el: test3,
  extraRender: ({ next, stopGuide, el, guideMask, guideFocus, focusPosition, center, topCenter, rightCenter, bottomCenter, leftCenter }) => {
    guideMask.contains(secondStepPanel)&&guideMask.removeChild(secondStepPanel);
    next();
  }
}, {
  el: test4,
  padding: { top: 5, right: 5, bottom: 5, left: 5 }
}]
setTimeout(() => {
  guide(items, padding);
}, 100);