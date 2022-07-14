function createStyleElement() {
	return document.createElement("style");
}

export function ejectStyle() {
	const styleEle = createStyleElement();
	const style = `#screenshotBox {
    border: 1px solid #0066ff;
    box-shadow: 0px 0px 1000px 10000px rgb(0, 0, 0, 35%);
  }
  #screenshotBox:hover {
    cursor: move;
  }

  .nonDrag {
    cursor: default !important;
  }

  #screenshotBox_menu {
    background-color: #fff;
    position: absolute;
    height: 28px;
    right: 0;
    bottom: -34px;
    cursor: pointer;
  }
  .screenshotBox_menu_item {
    box-sizing: border-box;
    margin: 4px 10px;
    line-height: 20px;
    display: inline-block;
  }
  .screenshotBox_menu_item > img {
    height: 20px;
    width: 20px;
  }
  `;
	styleEle.innerHTML = style;
	const headEle = document.getElementsByTagName("head")[0];
	headEle.appendChild(styleEle);
}
