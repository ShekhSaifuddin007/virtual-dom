const app = document.getElementById("app");

const cartAreaDiv = document.createElement("div");
cartAreaDiv.classList.add("cart-area");
app.append(cartAreaDiv);

const cartIconDiv = document.createElement("div");
cartIconDiv.classList.add("cart-icon");
cartAreaDiv.append(cartIconDiv);

cartIconDiv.innerHTML = `
	<svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
		<path
			d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
	</svg>

	<span class="item-count">0</span>
`;

const cartItemsDiv = document.createElement("div");
cartItemsDiv.style.display = "none";
cartItemsDiv.classList.add("cart-items");
cartAreaDiv.append(cartItemsDiv);

const cartHeadH1 = document.createElement("h1");
cartHeadH1.style.fontSize = "24px";
cartHeadH1.style.padding = "0 10px 10px";
cartHeadH1.style.textAlign = "center";
cartHeadH1.textContent = "Shopping Cart";
cartItemsDiv.append(cartHeadH1);

const cartItemWrapDiv = document.createElement("div");
cartItemWrapDiv.classList.add("cart-item-wrap");
cartItemsDiv.append(cartItemWrapDiv);

const NoItemInCartDiv = document.createElement("div");
NoItemInCartDiv.classList.add("no-item-in-cart");
NoItemInCartDiv.textContent = "Your cart is empty";
cartItemWrapDiv.append(NoItemInCartDiv);

const cartItemsHr = document.createElement("hr");
cartItemsHr.style.margin = "20px 0 10px";
cartItemsDiv.append(cartItemsHr);

const cartTotalDiv = document.createElement("div");
cartTotalDiv.classList.add("cart-total");
cartItemsDiv.append(cartTotalDiv);

const cartTotalTextSpan = document.createElement("span");
cartTotalTextSpan.textContent = "Total:";
cartTotalDiv.append(cartTotalTextSpan);

const cartTotalPriceSpan = document.createElement("span");
cartTotalPriceSpan.textContent = "0";
cartTotalDiv.append(cartTotalPriceSpan);

fetchAndAppendMarkup().then(() => {
	const cartIcon = document.querySelector(".cart-icon");
	const cartItems = document.querySelector(".cart-items");
	cartIcon.addEventListener("click", () => {
		if (cartItems.style.display === "none") {
			cartItems.style.display = "block";
		} else {
			cartItems.style.display = "none";
		}
	});

	const cartBtns = document.querySelectorAll(".cart-btn");

	cartBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const productdId = getParents(btn, ".product")[0].childNodes[0]
				.value;
			const productdImage = getParents(btn, ".product")[0].childNodes[1]
				.src;
			const productdTitle = getParents(btn, ".product")[0].childNodes[2]
				.childNodes[0].textContent;
			const productPrice = getParents(
				btn,
				".product"
			)[0].childNodes[2].childNodes[2].childNodes[0].childNodes[0].getAttribute(
				"product-price"
			);

			let cart = {
				id: productdId,
				image: productdImage,
				title: productdTitle,
				price: productPrice,
				qty: 1,
			};

			addToCart(cart);
		});
	});
});

const categoriesDiv = document.createElement("div");
categoriesDiv.classList.add("categories");
app.append(categoriesDiv);

async function fetchAndAppendMarkup() {
	return new Promise(async (resolve, reject) => {
		try {
			const products = await getProducts();

			const productsByCategory = getProductsByCategory(products);

			for (const [category, catProducts] of Object.entries(
				productsByCategory
			)) {
				const markups = markup(category, catProducts);

				categoriesDiv.append(markups);
			}

			resolve("Success");
		} catch (error) {
			reject(error);
		}
	});
}

async function getProducts() {
	const response = await fetch("https://dummyjson.com/products?limit=100");
	const { products } = await response.json();

	return products;
}

function getProductsByCategory(products) {
	const productsByCategory = {};

	products.forEach((product) => {
		if (productsByCategory.hasOwnProperty(product.category)) {
			productsByCategory[product.category].push(product);
		} else {
			productsByCategory[product.category] = [product];
		}
	});

	return productsByCategory;
}

function markup(category, products) {
	const categoryDiv = document.createElement("div");
	categoryDiv.classList.add("category");

	const catName = document.createElement("h3");
	catName.classList.add("cat-name", "capitalize");
	catName.textContent = category ?? "cat name";
	categoryDiv.append(catName);

	const productsDiv = document.createElement("div");
	productsDiv.classList.add("products");
	categoryDiv.append(productsDiv);

	products.forEach((product) => {
		const productDiv = document.createElement("div");
		productDiv.classList.add("product");
		productsDiv.append(productDiv);

		const productIdInput = document.createElement("input");
		productIdInput.classList.add("product-id");
		productIdInput.value = product.id;
		productIdInput.type = "hidden";
		productDiv.append(productIdInput);

		const img = document.createElement("img");
		img.src = product.thumbnail;
		img.alt = product.title;
		productDiv.append(img);

		const detailsDiv = document.createElement("div");
		detailsDiv.classList.add("details");
		productDiv.append(detailsDiv);

		const pTitleDiv = document.createElement("div");
		pTitleDiv.classList.add("p-title");
		pTitleDiv.textContent = product.title;
		detailsDiv.append(pTitleDiv);

		const descriptionDiv = document.createElement("div");
		descriptionDiv.classList.add("description");
		descriptionDiv.textContent = product.description;
		detailsDiv.append(descriptionDiv);

		const priceRateDiv = document.createElement("div");
		priceRateDiv.classList.add("price-rate");
		detailsDiv.append(priceRateDiv);

		const priceDiv = document.createElement("div");
		priceDiv.classList.add("price");
		priceRateDiv.append(priceDiv);

		const priceSpan = document.createElement("span");
		priceSpan.setAttribute("product-price", product.price);
		priceSpan.textContent = `Price: $${product.price}`;
		priceDiv.append(priceSpan);

		const ratingDiv = document.createElement("div");
		ratingDiv.classList.add("rating");
		priceRateDiv.append(ratingDiv);

		const ratingSpan = document.createElement("span");
		ratingSpan.textContent = `Rating: ${product.rating} / 5`;
		ratingDiv.append(ratingSpan);

		const cartBtnWrapDiv = document.createElement("div");
		cartBtnWrapDiv.style.width = "100%";
		detailsDiv.append(cartBtnWrapDiv);

		const cartBtn = document.createElement("button");
		cartBtn.type = "button";
		cartBtn.classList.add("cart-btn");
		cartBtn.textContent = "Add to cart";
		cartBtnWrapDiv.append(cartBtn);
	});

	return categoryDiv;
}

function addToCart(cart) {
	const cardProductdIds = document.querySelectorAll(".card-product-id");

	for (let i = 0; i < cardProductdIds.length; i++) {
		if (+cardProductdIds[i].value === +cart.id) {
			cardProductdIds[i].nextElementSibling.value++;
			let price =
				cardProductdIds[i].nextElementSibling.nextElementSibling.value;

			cardProductdIds[i].parentElement.previousElementSibling.children[1].textContent =
				+price * +cardProductdIds[i].nextElementSibling.value;

			updateCartPrice();

			return;
		}
	}

	document.querySelector(".item-count").textContent =
		cardProductdIds.length + 1;

	const cartItemDiv = document.createElement("div");
	cartItemDiv.classList.add("cart-item");

	const cartItemImage = document.createElement("img");
	cartItemImage.src = cart.image;
	cartItemImage.alt = cart.title;
	cartItemDiv.append(cartItemImage);

	const pNamePriceDiv = document.createElement("div");
	pNamePriceDiv.classList.add("p-name-price");
	cartItemDiv.append(pNamePriceDiv);

	const cpNameSpan = document.createElement("span");
	cpNameSpan.classList.add("cp-name", "capitalize");
	cpNameSpan.textContent = cart.title;
	pNamePriceDiv.append(cpNameSpan);

	const cpPriceSpan = document.createElement("span");
	cpPriceSpan.classList.add("cp-price");
	cpPriceSpan.textContent = cart.price * cart.qty;
	pNamePriceDiv.append(cpPriceSpan);

	const closeQtyDiv = document.createElement("div");
	closeQtyDiv.classList.add("close-qty");
	cartItemDiv.append(closeQtyDiv);

	const cardProductdIdInput = document.createElement("input");
	cardProductdIdInput.classList.add("card-product-id");
	cardProductdIdInput.value = cart.id;
	cardProductdIdInput.type = "hidden";
	closeQtyDiv.append(cardProductdIdInput);

	const cartQtyInput = document.createElement("input");
	cartQtyInput.classList.add("cart-qty");
	cartQtyInput.type = "number";
	cartQtyInput.setAttribute("oninput", "changeQuantity(event)");
	cartQtyInput.value = cart.qty;
	closeQtyDiv.append(cartQtyInput);

	const cardRowPriceIdInput = document.createElement("input");
	cardRowPriceIdInput.value = cart.price;
	cardRowPriceIdInput.type = "hidden";
	closeQtyDiv.append(cardRowPriceIdInput);

	const deleteItemA = document.createElement("a");
	deleteItemA.href = "#";
	deleteItemA.setAttribute("onclick", "removeItem(this)");
	deleteItemA.classList.add("delete-item");
	deleteItemA.innerHTML = `
		<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
			<path
				d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
		</svg>
	`;
	closeQtyDiv.append(deleteItemA);

	cartItemWrapDiv.append(cartItemDiv);

	updateCartPrice();
}

function updateCartPrice() {
	const cardProductdIds = document.querySelectorAll(".card-product-id");

	if (cardProductdIds.length >= 0) {
		NoItemInCartDiv.style.display = "none";
	}
	if (cardProductdIds.length <= 0) {
		NoItemInCartDiv.removeAttribute("style");
	}

	let total = 0;
	for (let i = 0; i < cardProductdIds.length; i++) {
		let price =
			cardProductdIds[i].parentElement.previousElementSibling.children[1]
				.textContent;

		total = +total + +price;
	}

	const cartTotal = document.querySelector(".cart-total").children[1];

	cartTotal.textContent = `$${total}`;
}

function removeItem(_self) {
	event.preventDefault();
	_self.parentElement.parentElement.remove();

	const cardProductdIds = document.querySelectorAll(".card-product-id");

	document.querySelector(".item-count").textContent = cardProductdIds.length;

	updateCartPrice();
}

function changeQuantity(e) {
	let price = e.target.nextElementSibling.value;
	let rowTotal = e.target.parentElement.previousElementSibling.children[1];

	var input = e.target;
	if (isNaN(input.value) || input.value <= 0) {
		input.value = 1;
	}

	rowTotal.textContent = +price * +input.value;

	updateCartPrice();
}

function getParents(elem, selector) {
	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function (s) {
				var matches = (
						this.document || this.ownerDocument
					).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	// Set up a parent array
	var parents = [];

	// Push each parent element to the array
	for (; elem && elem !== document; elem = elem.parentNode) {
		if (selector) {
			if (elem.matches(selector)) {
				parents.push(elem);
			}
			continue;
		}

		parents.push(elem);
	}

	// Return our parent array
	return parents;
}
