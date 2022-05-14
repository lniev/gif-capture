export default class FrameBox {
	constructor(config) {
		// todo other config
		this.config = config;
	}
	width = 0;
	height = 0;
	clientX = 0;
	clientY = 0;
	screenX = 0;
	screenY = 0;
	menu = null;
	static boxId = "screenshotBox";

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

	static creatMenu(config) {
		const menuDiv = document.createElement("div");
		const height = 28;
		menuDiv.style.height = height + "px";
		// menuDiv.style.width = 100 + "px";
		menuDiv.style.backgroundColor = "#fff";
		menuDiv.style.border = "1px solid #ccc";
		menuDiv.style.position = "absolute";
		menuDiv.style.right = "0px";
		menuDiv.style.bottom = -height - 5 + "px";
		config?.forEach(menu => {
			const menuItem = document.createElement("span");
			menuItem.addEventListener("click", menu.onClick);
			menuItem.style.margin = "4px 10px";
			menuItem.style.lineHeight = "20px";
			menuItem.style.display = "inline-block";
			menuItem.innerHTML = menu.label;
			menuDiv.appendChild(menuItem);
		});
		return menuDiv;
	}

	drawBox = e => {
		const [startX, startY] = [e.clientX, e.clientY];
		// 创建box元素
		const boxEle = FrameBox.createBoxElement();
		// 设置box的位置
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
			boxEle.style.width = Math.abs(moveX) + "px";
			boxEle.style.height = Math.abs(moveY) + "px";
			if (moveX < 0) {
				boxEle.left = e.clientX + "px";
			}
			if (moveY < 0) {
				boxEle.top = e.clientY + "px";
			}
		};
		window.addEventListener("mousemove", moveEvent);
		window.addEventListener("mouseup", () => {
			const menu = FrameBox.creatMenu(this.config.menus);
			this.menu = menu;
			boxEle.appendChild(menu);
			window.removeEventListener("mousemove", moveEvent);
			window.removeEventListener("mousedown", this.drawBox);
		});
	};

	static removeBox() {
		const boxElement = document.getElementById(FrameBox.boxId);
		console.log(boxElement);
		boxElement.remove();
	}

	readyDrawBox() {
		window.addEventListener("mousedown", this.drawBox);
	}
}
