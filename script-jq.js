$("<div></div>", { class: "cart-area" }).appendTo("#app");

$("<div></div>", {
	class: "cart-icon",
}).appendTo(".cart-area").html(`
     	<svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
     		<path
     			d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
     	</svg>
    
     	<span class="item-count">0</span>
    `);

$("<div></div>", {
	class: "cart-items",
})
	.appendTo(".cart-area")
	.css({ display: "none" });

$("<h1></h1>", {
	text: "Shopping Cart",
})
	.appendTo(".cart-items")
	.css({ fontSize: "24px", padding: "0 10px 10px", textAlign: "center" });

$("<div></div>", { class: "cart-item-wrap" }).appendTo(".cart-items");

$("<div></div>", {
	class: "no-item-in-cart",
	text: "Your cart is empty",
}).appendTo(".cart-item-wrap");

$("<hr />").appendTo(".cart-items").css({ margin: "20px 0 10px" });

$("<div></div>", { class: "cart-total" }).appendTo(".cart-items");

$("<span></span>", { text: "Total:" }).appendTo(".cart-total");

$("<span></span>", { text: "0" }).appendTo(".cart-total");

const categoriesDiv = $("<div></div>", { class: "categories" }).appendTo(
	"#app"
);

$.get("https://dummyjson.com/products?limit=100").then(({ products }) => {
	const productsByCategory = getProductsByCategory(products);

	for (const [category, catProducts] of Object.entries(productsByCategory)) {
		const markups = markup(category, catProducts);

		$(markups).appendTo(categoriesDiv);
	}
});

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
	const html = `
    <div class="category">
        <h3 class="cat-name capitalize">${category}</h3>
        <div class="products">
            ${products
				.map((product) => {
					return `<div class="product">
                    <input class="product-id" type="hidden" value="${product.id}">
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <div class="details">
                        <div class="p-title">${product.title}</div>
                        <div class="description">${product.description}</div>
                        <div class="price-rate">
                            <div class="price">
                                <span product-price="${product.price}">Price: $${product.price}</span>
                            </div>
                            <div class="rating">
                                <span>Rating: ${product.rating} / 5</span>
                            </div>
                        </div>
                        <div style="width: 100%;">
                            <button type="button" class="cart-btn">Add to cart</button>
                        </div>
                    </div>
                </div>`;
				})
				.join("")}
        </div>
    </div>`;

	return html;
}

$(document).on("click", ".cart-btn", function () {
	const productdId = $(this).parents(".product").find(".product-id").val();
	const productdImage = $(this).parents(".product").find("img").attr("src");
	const productdTitle = $(this).parents(".product").find(".p-title").text();
	const productPrice = $(this)
		.parents(".product")
		.find(".price > span")
		.attr("product-price");

	let cart = {
		id: productdId,
		image: productdImage,
		title: productdTitle,
		price: productPrice,
		qty: 1,
	};

	addToCart(cart);
});

function addToCart(cart) {
	const cardProductdIds = $(".card-product-id");

	for (let i = 0; i < cardProductdIds.length; i++) {
		if (+$(cardProductdIds[i]).val() === +cart.id) {
			let qty = $(cardProductdIds[i])
				.siblings(".cart-qty")
				.val(function (i, oldval) {
					return ++oldval;
				});

			let price = $(cardProductdIds[i]).siblings(".cart-price").val();

			console.log($(cardProductdIds[i]).siblings(".cart-price").val());

			$(cardProductdIds[i])
				.parents(".cart-item")
				.find(".cp-price")
				.text(
					+price * +$(cardProductdIds[i]).siblings(".cart-qty").val()
				);

			updateCartPrice();

			return;
		}
	}

	$(".item-count").text(cardProductdIds.length + 1);

	const cartItem = `
    <div class="cart-item">
        <img src="${cart.image}" alt="${cart.title}">
        <div class="p-name-price">
            <span class="cp-name capitalize">${cart.title}</span>
            <span class="cp-price">${cart.price}</span>
        </div>
        <div class="close-qty">
            <input class="card-product-id" type="hidden" value="${cart.id}">
            <input class="cart-qty" type="number" value="${cart.qty}">
			<input type="hidden" class="cart-price" value="${cart.price}">
            <a href="#" class="delete-item">
	 	        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	 		        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
	 	        </svg>
	        </a>
        </div>
    </div>`;

	$(".cart-item-wrap").append(cartItem);

	updateCartPrice();
}

$(document).on("click", ".cart-icon", function () {
	$(".cart-items").toggle();
});

$(document).on("click", ".delete-item", function (e) {
	e.preventDefault();
	$(this).parents('.cart-item').remove();

	$(".item-count").text($(".card-product-id").length);

	updateCartPrice();
});

$(document).on("input", ".cart-qty", function (e) {
	let price = $(this).siblings('.cart-price').val();
	let rowTotal = $(this).parents('.cart-item').find('.cp-price');

	console.log(rowTotal);

	var input = $(this).val();
	if (isNaN(input) || input <= 0) {
		$(this).val(1);
	}

	rowTotal.text(+price * +input);

	updateCartPrice();
});

function updateCartPrice() {
	const cardProductdIds = $(".card-product-id");
	const NoItemInCartDiv = $(".no-item-in-cart");

	if (cardProductdIds.length >= 0) {
		NoItemInCartDiv.css({ display: "none" });
	}
	if (cardProductdIds.length <= 0) {
		NoItemInCartDiv.removeAttr("style");
	}

	let total = 0;
	for (let i = 0; i < cardProductdIds.length; i++) {
		let price = $(cardProductdIds[i])
			.parents(".cart-item")
			.find(".cp-price")
			.text();

		total = +total + +price;
	}

	const cartTotal = $(".cart-total").find("span + span");

	cartTotal.text(`$${total}`);
}
