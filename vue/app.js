import { onMounted, ref } from "vue";

import Cart from "./cart.js";
import ProductsByCategory from "./productsByCategory.js";

export default {
	components: {
		Cart,
		ProductsByCategory,
	},

	setup() {
		const carts = ref([]);
		const productsByCategory = ref([]);

		onMounted(() => {
			axios
				.get("https://dummyjson.com/products?limit=100")
				.then(({ data }) => {
					productsByCategory.value = getProductsByCategory(
						data.products
					);
				});
		});

		const pushToCart = (cart) => {
			const productExistOnCart = carts.value.find(c => c.id === cart.id)

			if (productExistOnCart !== undefined && productExistOnCart !== null) {
                productExistOnCart.qty +=1;
            } else {
                carts.value.unshift(cart)
            }
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

		return {
			productsByCategory,
			carts,
			pushToCart
		};
	},

	template: `
		<Cart :carts="carts" />

		<div class="categories">
			<ProductsByCategory :productsByCategory="productsByCategory" @pushToCart="pushToCart" />
		</div>`,
};
