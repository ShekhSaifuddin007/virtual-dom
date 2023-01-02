import { toRefs } from "vue";

export default {
	props: {
		products: Object,
	},

	setup(props, ctx) {
		const { products } = toRefs(props);

		const addToCart = (product) => {
            const cart = {
				id: product.id,
				image: product.thumbnail,
				title: product.title,
				price: product.price,
				qty: 1,
			};

			ctx.emit('pushToCart', cart)
		};

		return { products, addToCart };
	},

	template: `
    <div class="product" v-for="product in products" :key="product.id">
        <input class="product-id" type="hidden" value="1">
        <img :src="product.thumbnail" :alt="product.title">
        <div class="details">
            <div class="p-title">{{ product.title }}</div>
            <div class="description">{{ product.description }}</div>
            <div class="price-rate">
                <div class="price">
                    Price: $<span>{{ product.price }}</span>
                </div>
                <div class="rating">
                    <span>Rating: {{ product.rating }} / 5</span>
                </div>
            </div>
        <div style="width: 100%;">
            <button type="button" @click.prevent="addToCart(product)" class="cart-btn">Add to cart</button>
        </div>
    </div>`,
};
