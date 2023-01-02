import { toRefs } from "vue";
import Product from "./product.js";

export default {
	props: {
		productsByCategory: Object,
	},

    components: {
		Product
	},

	setup(props, ctx) {
		const { productsByCategory } = toRefs(props);

        const pushToCart = (cart) => {
            ctx.emit('pushToCart', cart)
        }

		return { productsByCategory, pushToCart };
	},

	template: `
		<div class="categories">
			<div class="category" v-for="[category, products] of Object.entries(productsByCategory)" :key="category">
				<h3 class="cat-name capitalize">{{ category }}</h3>
				<div class="products">
					<Product :products="products" @pushToCart="pushToCart" />
				</div>
			</div>
		</div>`,
};
