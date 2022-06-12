export default class FrameBox {
	constructor(config) {
		// todo other config
		this.config = config;
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
		element.style.position = "absolute";
		element.style.top = top + "px";
		element.style.left = left + "px";
	}

	static createMenu = config => {
		const menuDiv = document.createElement("div");
		const height = 28;
		menuDiv.style.height = height + "px";
		menuDiv.style.bottom = -height - 5 + "px";
		menuDiv.style.cursor = "pointer";
		menuDiv.setAttribute("id", "screenshotBox_menu");

		config?.forEach(menu => {
			const menuItem = document.createElement("span");
			menuItem.addEventListener("click", menu.onClick);
			menuItem.setAttribute("class", "screenshotBox_menu_item");
			menuItem.innerHTML = menu.label;
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
		};
		window.addEventListener("mouseup", mouseUpEvent);
	};

	removeBox() {
		const boxElement = document.getElementById(FrameBox.boxId);
		boxElement && boxElement.remove();
	}

	readyDrawBox() {
		window.addEventListener("mousedown", this.drawBox);
	}
}
