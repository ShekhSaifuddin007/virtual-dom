document.addEventListener("alpine:init", () => {
	Alpine.store("state", {
		cartIsOpen: false,
		productsByCategory: [],
		carts: [],

		async init() {
			const response = await fetch(
				"https://dummyjson.com/products?limit=100"
			);
			const { products } = await response.json();

			this.productsByCategory = this.getProductsByCategory(products);
		},

		addToCart(product) {
			const productExistOnCart = this.carts.find(
				(c) => c.id === product.id
			);

			if (
				productExistOnCart !== undefined &&
				productExistOnCart !== null
			) {
				productExistOnCart.qty += 1;
			} else {
				this.carts.unshift({
					id: product.id,
					image: product.thumbnail,
					title: product.title,
					price: product.price,
					qty: 1,
				});
			}
		},

		preventNegative(id) {
			const cart = this.carts.find((c) => c.id === id);

			if (cart.qty < 1) {
				cart.qty = 1;
			}
		},

		cartTotal() {
			return `$${this.carts.reduce(
				(acc, cart) => acc + cart.price * cart.qty,
				0
			)}`;
		},

		removeItem(cart) {
			this.carts.splice(this.carts.indexOf(cart), 1);
		},

		getProductsByCategory(products) {
			const productsByCategory = {};

			products.forEach((product) => {
				if (productsByCategory.hasOwnProperty(product.category)) {
					productsByCategory[product.category].push(product);
				} else {
					productsByCategory[product.category] = [product];
				}
			});

			return productsByCategory;
		},
	});
});
