import { ejectStyle } from "./styles.js";
export default class FrameBox {
	constructor(config) {
		// todo other config
		this.config = config;
		ejectStyle()
	}
	offsetWidth = 0;
	offsetHeight = 0;
	clientWidth = 0;
	clientHeight = 0;
	clientX = 0;
	clientY = 0;
	screenX = 0;
	screenY = 0;
	menu = null;
	borderWidth = 1;
	static boxId = "screenshotBox";
	boxElement = null;

	getBoxInfo = () => {
		return {
			clientX: this.clientX,
			clientY: this.clientY,
			offsetWidth: this.offsetWidth,
			offsetHeight: this.offsetHeight,
			clientWidth: this.clientWidth,
			clientHeight: this.clientHeight,
			screenX: this.screenX,
			screenY: this.screenY,
			borderWidth: this.borderWidth,
			menu: this.menu,
		};
	};

	/**
	 * Handling multi-screen coordinates
	 * @param x
	 * @return {number|number|*}
	 */
	static getPositionX(x) {
		if (!x) return 0;
		const oneScreenWidth = window.screen.width;
		const subWidth = x > oneScreenWidth ? oneScreenWidth - oneScreenWidth : x;
		return subWidth > oneScreenWidth
			? FrameBox.getPositionX(subWidth)
			: subWidth;
	}

	/**
	 * @returns divElement
	 */
	static createBoxElement() {
		const divEle = document.createElement("div");
		divEle.id = FrameBox.boxId;
		divEle.width = "1px";
		divEle.height = "1px";
		return divEle;
	}

	/**
	 * @param {HTMLElement} element
	 * @param {number} left
	 * @param {number} top
	 */
	static setBoxPosition(element, left, top) {
		element.style.position = "fixed";
		element.style.top = top + "px";
		element.style.left = left + "px";
	}
	/**
	 * 父节点插入img icon
	 * @param {HTMLElement} iconEle
	 * @param {HTMLElement} parentNode
	 */
	static appendIcon(iconEle, parentNode) {
		const isImgEle =
			Object.prototype.toString.call(iconEle) === "[object HTMLImageElement]";
		if (isImgEle && parentNode) {
			parentNode.appendChild(iconEle);
		}
	}

	/**
	 *	父节点追加text
	 * @param {string} text
	 * @param {HTMLElement} parentNode
	 */
	static appendTextNode(text, parentNode) {
		if (!text) return;
		const textNode = document.createTextNode(text || "");
		parentNode && parentNode.appendChild(textNode);
	}

	static createMenu = config => {
		const menuDiv = document.createElement("div");
		menuDiv.setAttribute("id", "screenshotBox_menu");

		config?.forEach(menu => {
			const menuItem = document.createElement("span");
			menuItem.addEventListener("click", menu.onClick);
			menuItem.setAttribute("class", "screenshotBox_menu_item");
			FrameBox.appendIcon(menu.icon, menuItem);
			FrameBox.appendTextNode(menu.labelEle, menuItem);
			// 设置自定义行内样式
			menu.style && menuItem.setAttribute("style", menu.style);
			// 将dom元素抛出去
			menu.getElement && menu.getElement(menuItem);
			menuDiv.appendChild(menuItem);
		});
		return menuDiv;
	};

	preHandleMultipleBox = () => {
		if (this.boxElement) this.removeBox();
	};

	drawBox = e => {
		this.preHandleMultipleBox();
		const [startX, startY] = [e.clientX, e.clientY];
		// 创建box元素
		const boxEle = FrameBox.createBoxElement();
		this.boxElement = boxEle;
		// 设置box的初始位置
		FrameBox.setBoxPosition(boxEle, startX, startY);

		// 多屏幕获取在当前屏幕下的screen、client位置
		this.screenX = FrameBox.getPositionX(e.screenX);
		this.screenY = e.screenY;
		this.clientX = startX;
		this.clientY = startY;
		// 插入元素
		document.body.appendChild(boxEle);

		const moveEvent = e => {
			const moveX = e.clientX - startX;
			const moveY = e.clientY - startY;
			this.offsetWidth = Math.abs(moveX);
			this.offsetHeight = Math.abs(moveY);
			boxEle.style.width = this.offsetWidth + "px";
			boxEle.style.height = this.offsetHeight + "px";
			if (moveX < 0) {
				boxEle.style.left = e.clientX + "px";
				this.clientX = e.clientX;
				this.screenX = e.screenX;
			}
			if (moveY < 0) {
				boxEle.style.top = e.clientY + "px";
				this.clientY = e.clientY;
				this.screenY = e.screenY;
			}
		};
		window.addEventListener("mousemove", moveEvent);
		const mouseUpEvent = () => {
			const menu = FrameBox.createMenu(this.config.menus);
			this.menu = menu;
			this.clientWidth = boxEle.clientWidth;
			this.clientHeight = boxEle.clientHeight;
			boxEle.appendChild(menu);
			window.removeEventListener("mousemove", moveEvent);
			window.removeEventListener("mousedown", this.drawBox);
			window.removeEventListener("mouseup", mouseUpEvent);
			this.addBoxEvent();
		};
		window.addEventListener("mouseup", mouseUpEvent);
	};

	addBoxEvent() {
		// 允许拖拽
		this.setBoxEleDraggable(true)
		// 记录每次拖拽开始的top,left
		let left = 0;
		let top = 0;
		// 记录开始拖拽event的client坐标
		let moveStartX = 0;
		let moveStartY = 0;
		let moveWidth = 0;
		let moveHeight = 0;

		const moveBox = e => {
			// 拖拽最后一下位置不处理
			if (e.clientX <= 0 || e.clientY <= 0) return;
			moveWidth = e.clientX - moveStartX;
			moveHeight = e.clientY - moveStartY;
			if (isNaN(left) || isNaN(top)) return;
			this.boxElement.style.left = left + moveWidth + "px";
			this.boxElement.style.top = top + moveHeight + "px";
		};

		const moveEnd = e => {
			this.setPositions(moveWidth, moveHeight);
		};

		const startMoveBox = e => {
			left = parseInt(this.boxElement.style.left?.split("px")[0]);
			top = parseInt(this.boxElement.style.top?.split("px")[0]);
			moveStartX = e.clientX;
			moveStartY = e.clientY;
			this.boxElement.addEventListener("drag", moveBox);
			this.boxElement.addEventListener("dragend", moveEnd);
		};
		this.boxElement.addEventListener("dragstart", startMoveBox);
	}
	// can not drag when you start recording
	setBoxEleDraggable(boolean) {
		this.boxElement.draggable = boolean
		this.setBoxEleDraggableStyle(boolean)
	}

	//set cursor when start recording
	setBoxEleDraggableStyle(boolean)	 {
		if (boolean) {
			this.boxElement.setAttribute("class", "");
		} else {
			this.boxElement.setAttribute("class", "nonDrag");
		}
	}

	setPositions(moveWidth, moveHeight) {
		this.clientX += moveWidth;
		this.clientY += moveHeight;
		this.screenX += moveWidth;
		this.screenY += moveHeight;
	}

	removeBox() {
		const boxElement = document.getElementById(FrameBox.boxId);
		boxElement && boxElement.remove();
	}

	readyDrawBox() {
		window.addEventListener("mousedown", this.drawBox);
	}
}
