import { computed, ref, toRefs } from "vue";

export default {
	props: {
		carts: Array,
	},

	setup(props) {
		const cartShowHide = ref(false);
		const { carts } = toRefs(props);

		const cartTotal = computed(
			() =>
				`$${carts.value.reduce(
					(acc, cart) => acc + cart.price * cart.qty,
					0
				)}`
		);

		const removeItem = (cart) =>
			carts.value.splice(carts.value.indexOf(cart), 1);

		const preventNegative = (id) => {
			const cart = carts.value.find(c => c.id === id)

            if (cart.qty < 1) {
                cart.qty = 1
            }
		};

		return { cartShowHide, carts, cartTotal, removeItem, preventNegative };
	},

	template: `
    <div class="cart-area">
        <div @click.prevent="cartShowHide = ! cartShowHide" class="cart-icon">
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path
                    d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
                </path>
            </svg>
            <span class="item-count">{{ carts.length }}</span>
        </div>

        <div class="cart-items" v-if="cartShowHide">
            <h1 style="font-size: 24px; padding: 0px 10px 10px; text-align: center;">Shopping Cart</h1>
            <div class="cart-item-wrap">
                <div v-if="! carts.length" class="no-item-in-cart">Your cart is empty</div>
                <div class="cart-item" v-for="cart in carts" :key="cart.id">
                    <img :src="cart.image" :alt="cart.title">
                    <div class="p-name-price">
                        <span class="cp-name capitalize">{{ cart.title }}</span>
                        <span class="cp-price">{{ cart.price * cart.qty}}</span>
                    </div>
                    <div class="close-qty">
                        <input class="cart-qty" type="number" @input="preventNegative(cart.id)" v-model="cart.qty">
                        <a href="#" @click.prevent="removeItem(cart)" class="delete-item">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <hr style="margin: 20px 0px 10px;">
            <div class="cart-total">
                <span>Total:</span>
                <span>{{ cartTotal }}</span>
            </div>
        </div>
    </div>`,
};
