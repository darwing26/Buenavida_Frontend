import CartModalTemplate from "../templates/cartModalTemplate.js";
import CheckoutModalTemplate from "../templates/checkoutModalTemplate.js";
import ProductBoxTemplate from "../templates/productBoxTemplate.js";
import ProductModalTemplate from "../templates/productModalTemplate.js";
export default class ProductsView {
    selector;
    selectorName = "productos";
    subject;
    modal;
    modalBody;
    closeModalBtn;
    cartItems = [];
    cartModal;
    cartBody;
    cartButton;
    closeModalBtnCart;
    currentPage = 1;
    paginationContainer;
    // Elementos para búsqueda y filtros
    searchInput;
    searchButton;
    filterButton;
    priceSliderMin;
    priceSliderMax;
    favoritesButton;
    // Estado del usuario (simulado - en producción vendría de autenticación)
    // Simulando usuario logueado
    checkoutModal;
    checkoutBody;
    constructor(subject) {
        this.subject = subject;
        this.selector = document.createElement("div");
        // Initialize modal elements
        this.modal = document.querySelector("#product-modal");
        this.modalBody = document.querySelector("#modal-body");
        this.closeModalBtn = document.querySelector(".close-btn");
        // Initialize cart modal elements
        this.cartModal = document.querySelector("#cart-modal");
        this.cartBody = document.querySelector("#cart-body");
        this.cartButton = document.querySelector("#cart-btn");
        this.closeModalBtnCart = document.querySelector(".close-btn2");
        // Initialize search and filter elements
        this.searchInput = document.querySelector(".search-container input");
        this.searchButton = document.querySelector(".search-container button");
        this.filterButton = document.querySelector(".filter-button");
        this.priceSliderMin = document.querySelector("#slider-1");
        this.priceSliderMax = document.querySelector("#slider-2");
        this.favoritesButton = document.querySelector(".fas.fa-heart")
            ?.parentElement;
        // Create pagination container
        this.paginationContainer = document.createElement("div");
        this.paginationContainer.className = "pagination-container";
        // Initialize checkout modal elements
        this.checkoutModal = document.querySelector("#checkout-modal");
        this.checkoutBody = document.querySelector("#checkout-body");
    }
    async init() {
        this.selector = document.querySelector(this.selectorName);
        if (!this.selector) {
            console.error(`Element with selector ${this.selectorName} not found`);
            return;
        }
        // Modal events
        this.closeModalBtn.addEventListener("click", this.closeModal);
        this.cartButton.addEventListener("click", () => this.openCartModal());
        // Search events
        this.searchButton.addEventListener("click", this.handleSearch);
        this.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.handleSearch();
            }
        });
        // Filter events
        this.filterButton.addEventListener("click", this.handlePriceFilter);
        // Favorites events
        if (this.favoritesButton) {
            this.favoritesButton.addEventListener("click", this.handleShowFavorites);
        }
        // Initialize cart counter
        this.updateCartItemCount();
        // Add clear filters button (create it dynamically)
        this.createClearFiltersButton();
        // Evento para abrir checkout desde el carrito
        this.cartBody.addEventListener("click", async (e) => {
            if (e.target.id === "clear-cart") {
                this.closeCartModal();
                await this.openCheckoutModal();
            }
        });
        // Evento para guardar el pedido
        this.checkoutBody.addEventListener("click", async (e) => {
            if (e.target.id === "submit-order") { // Cambiado a submit-order
                await this.saveOrder();
            }
        });
        await this.otherGetFavorites();
    }
    ;
    createClearFiltersButton() {
        const filterContainer = document.querySelector(".wrapper");
        if (filterContainer) {
            console.log("Filter container found");
        }
    }
    handleSearch = async () => {
        const searchTerm = this.searchInput.value.trim();
        this.currentPage = 1;
        if (searchTerm) {
            await this.subject.searchProducts(searchTerm, this.currentPage);
        }
        else {
            await this.subject.clearFilters(this.currentPage);
        }
        await this.render();
        this.updateStatusMessage();
    };
    handlePriceFilter = async () => {
        const minPrice = parseInt(this.priceSliderMin.value);
        const maxPrice = parseInt(this.priceSliderMax.value);
        this.currentPage = 1;
        await this.subject.filterByPrice(minPrice, maxPrice, this.currentPage);
        await this.render();
        this.updateStatusMessage();
    };
    handleShowFavorites = async () => {
        this.currentPage = 1;
        await this.subject.getFavorites(this.currentPage);
        await this.render();
        this.updateStatusMessage();
    };
    updateStatusMessage() {
        const state = this.subject.getCurrentState();
        let message = "";
        console.log("Estado actual:", message);
        if (state.isSearching) {
            message = `Resultados de búsqueda para: "${state.searchTerm}"`;
        }
        else if (state.isFiltering) {
            message = `Productos filtrados por precio: ${state.minPrice}€ - ${state.maxPrice}€`;
        }
        else if (state.showingFavorites) {
            message = "Mostrando tus productos favoritos";
        }
        else {
            message = "Mostrando todos los productos";
        }
        // Create or update status message element
    }
    async render() {
        if (!this.selector)
            return;
        this.selector.innerHTML = "";
        const products = this.subject.getProducts();
        const totalPages = this.subject.getTotalPages();
        this.currentPage = this.subject.getCurrentPage();
        console.log("Total de páginas:", totalPages);
        // Siempre intentar cargar productos si no hay ninguno
        if (products.length === 0) {
            await this.subject.fetchProducts(this.currentPage);
        }
        // Render products or no results message
        const currentProducts = this.subject.getProducts();
        if (currentProducts.length === 0) {
            this.renderNoResults();
        }
        else {
            for (const product of currentProducts) {
                const productHtml = await ProductBoxTemplate.render(product);
                const productCard = document.createElement("div");
                productCard.innerHTML = productHtml;
                productCard.addEventListener("click", () => this.openModal(product));
                // Add event to "Add to cart" button on the card
                const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
                if (addToCartBtn) {
                    addToCartBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        this.addToCartFromCard(product);
                        this.updateCartItemCount();
                    });
                }
                this.selector.appendChild(productCard);
            }
        }
        // Render pagination - Siempre mostrar paginación si hay más de 1 página
        const updatedTotalPages = this.subject.getTotalPages();
        this.renderPagination(updatedTotalPages);
    }
    renderNoResults() {
        const noResultsDiv = document.createElement("div");
        noResultsDiv.className = "no-results";
        noResultsDiv.style.textAlign = "center";
        noResultsDiv.style.padding = "40px";
        noResultsDiv.style.color = "#6c757d";
        noResultsDiv.innerHTML = `
            <h3>No se encontraron productos</h3>
            <p>Intenta con otros términos de búsqueda o ajusta los filtros.</p>
        `;
        this.selector.appendChild(noResultsDiv);
    }
    renderPagination(totalPages) {
        this.paginationContainer.innerHTML = "";
        const existingPagination = document.querySelector(".pagination-container");
        if (existingPagination) {
            existingPagination.remove();
        }
        if (totalPages <= 1)
            return;
        const paginationDiv = document.createElement("div");
        paginationDiv.className = "pagination";
        paginationDiv.style.display = "flex";
        paginationDiv.style.justifyContent = "flex-end";
        paginationDiv.style.alignItems = "center";
        paginationDiv.style.gap = "5px";
        paginationDiv.style.marginTop = "20px";
        paginationDiv.style.marginBottom = "20px";
        let startPage = 1;
        let endPage = totalPages;
        const maxVisiblePages = 5;
        if (totalPages > maxVisiblePages) {
            const halfVisible = Math.floor(maxVisiblePages / 2);
            if (this.currentPage <= halfVisible + 1) {
                endPage = maxVisiblePages;
            }
            else if (this.currentPage >= totalPages - halfVisible) {
                startPage = totalPages - maxVisiblePages + 1;
            }
            else {
                startPage = this.currentPage - halfVisible;
                endPage = this.currentPage + halfVisible;
            }
        }
        // Left arrow
        if (startPage > 1) {
            const leftArrow = document.createElement("button");
            leftArrow.innerHTML = "&laquo;";
            leftArrow.className = "page-btn";
            leftArrow.style.cursor = "pointer";
            leftArrow.style.padding = "5px 10px";
            leftArrow.style.border = "1px solid #5ccb5f";
            leftArrow.style.backgroundColor = "#5ccb5f";
            leftArrow.addEventListener("click", () => {
                this.changePage(startPage - 1);
            });
            paginationDiv.appendChild(leftArrow);
        }
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i.toString();
            pageBtn.className = `page-btn ${i === this.currentPage ? "active" : ""}`;
            pageBtn.style.cursor = "pointer";
            pageBtn.style.padding = "5px 10px";
            pageBtn.style.border = "1px solid #ddd";
            if (i === this.currentPage) {
                pageBtn.style.backgroundColor = "#5ccb5f";
                pageBtn.style.color = "white";
            }
            else {
                pageBtn.style.backgroundColor = "white";
            }
            pageBtn.addEventListener("click", () => {
                this.changePage(i);
            });
            paginationDiv.appendChild(pageBtn);
        }
        // Right arrow
        if (endPage < totalPages) {
            const rightArrow = document.createElement("button");
            rightArrow.innerHTML = "&raquo;";
            rightArrow.className = "page-btn";
            rightArrow.style.cursor = "pointer";
            rightArrow.style.padding = "5px 10px";
            rightArrow.style.border = "1px solid #ddd";
            rightArrow.style.backgroundColor = "#f8f9fa";
            rightArrow.addEventListener("click", () => {
                this.changePage(endPage + 1);
            });
            paginationDiv.appendChild(rightArrow);
        }
        this.paginationContainer.appendChild(paginationDiv);
        if (this.selector && this.selector.parentNode) {
            this.selector.parentNode.appendChild(this.paginationContainer);
        }
        else {
            this.selector.appendChild(this.paginationContainer);
        }
    }
    async changePage(page) {
        this.currentPage = page;
        const state = this.subject.getCurrentState();
        if (state.isSearching) {
            await this.subject.searchProducts(state.searchTerm, page);
        }
        else if (state.isFiltering) {
            await this.subject.filterByPrice(state.minPrice, state.maxPrice, page);
        }
        else if (state.showingFavorites) {
            await this.subject.getFavorites(page);
        }
        else {
            await this.subject.fetchProducts(page);
        }
        await this.render();
    }
    // Métodos existentes del modal y carrito (sin cambios)
    openModal = async (product) => {
        const modalContent = await ProductModalTemplate.render(product);
        this.modalBody.innerHTML = modalContent;
        this.modal.style.display = "flex";
        ProductModalTemplate.activateFavoriteListener();
        const addToCartBtn = this.modalBody.querySelector(".add-to-cart");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", () => {
                this.addToCart(product);
                this.updateCartItemCount();
            });
        }
        const decreaseBtn = document.querySelector("#decrease");
        const increaseBtn = document.querySelector("#increase");
        const quantityInput = document.querySelector(".quantity-selector input");
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener("click", () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantity--;
                    quantityInput.value = quantity.toString();
                }
            });
            increaseBtn.addEventListener("click", () => {
                let quantity = parseInt(quantityInput.value);
                quantity++;
                quantityInput.value = quantity.toString();
            });
        }
    };
    closeModal = () => {
        this.modal.style.display = "none";
        this.modalBody.innerHTML = "";
    };
    addToCartFromCard = (product) => {
        const quantity = 1;
        const existingItem = this.cartItems.find((item) => item.product.nombre === product.nombre);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            this.cartItems.push({ product, quantity });
        }
    };
    addToCart = (product) => {
        const quantityInput = this.modalBody.querySelector(".quantity-selector input");
        const quantity = parseInt(quantityInput.value);
        const existingItem = this.cartItems.find((item) => item.product.nombre === product.nombre);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            this.cartItems.push({ product, quantity });
        }
        this.closeModal();
    };
    openCartModal = async () => {
        const cartContent = await CartModalTemplate.render(this.cartItems);
        this.cartBody.innerHTML = cartContent;
        this.cartModal.style.display = "flex";
        this.cartBody.querySelectorAll(".quantity-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const action = e.target.getAttribute("data-action");
                const itemDiv = e.target.closest(".cart-item");
                const quantitySpan = itemDiv.querySelector("p span");
                let quantity = parseInt(quantitySpan.textContent || "1");
                if (action === "decrease" && quantity > 1) {
                    quantity--;
                }
                else if (action === "increase") {
                    quantity++;
                }
                quantitySpan.textContent = quantity.toString();
                const productName = itemDiv.querySelector("h3")?.textContent || "";
                const item = this.cartItems.find((item) => item.product.nombre === productName);
                if (item)
                    item.quantity = quantity;
                this.openCartModal();
                this.updateCartItemCount();
            });
        });
        this.cartBody.querySelectorAll(".remove-item").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const itemDiv = e.target.closest(".cart-item");
                const productName = itemDiv.querySelector("h3")?.textContent || "";
                this.cartItems = this.cartItems.filter((item) => item.product.nombre !== productName);
                this.openCartModal();
                this.updateCartItemCount();
            });
        });
        const closeCartBtn = this.closeModalBtnCart;
        if (closeCartBtn) {
            closeCartBtn.addEventListener("click", () => this.closeCartModal());
            this.cartModal.addEventListener("click", (e) => {
                if (e.target === this.cartModal)
                    this.closeCartModal();
            });
        }
    };
    closeCartModal = () => {
        this.cartModal.style.display = "none";
        this.cartBody.innerHTML = "";
    };
    updateCartItemCount = () => {
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartItemCount = document.querySelector("#cart-item-count");
        if (cartItemCount) {
            cartItemCount.textContent = totalItems.toString();
            cartItemCount.setAttribute("data-count", totalItems.toString());
        }
    };
    async otherGetFavorites() {
        {
            const favoritesItem = document.querySelector('.mi-cuenta-menu li[data-action="favorites"]');
            console.log("================", favoritesItem);
            if (favoritesItem) {
                favoritesItem.addEventListener('click', async () => {
                    await this.subject.getFavorites(1);
                    this.handleShowFavorites();
                    this.render();
                });
            }
            else {
                console.warn('Elemento no encontrado');
            }
        }
    }
    // ... (resto de la clase ProductsView)
    // Método para abrir la modal de checkout
    openCheckoutModal = async () => {
        const checkoutContent = await CheckoutModalTemplate.render(this.cartItems);
        this.checkoutBody.innerHTML = checkoutContent;
        this.checkoutModal.style.display = "flex";
        // Configurar el evento del botón de cierre
        const closeCheckoutBtn = this.checkoutModal.querySelector(".checkout-close-btn");
        if (closeCheckoutBtn) {
            closeCheckoutBtn.removeEventListener("click", this.closeCheckoutModal);
            closeCheckoutBtn.addEventListener("click", this.closeCheckoutModal.bind(this));
        }
        else {
            console.error("Botón de cierre '.checkout-close-btn' no encontrado en la modal de checkout");
        }
        // Configurar evento para cerrar al hacer clic fuera de la modal
        this.checkoutModal.removeEventListener("click", this.handleOutsideClick);
        this.checkoutModal.addEventListener("click", this.handleOutsideClick.bind(this));
        // Agregar evento para eliminar ítems
        this.checkoutBody.querySelectorAll(".checkout-remove-item").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const itemDiv = e.target.closest(".checkout-product-item");
                const index = parseInt(itemDiv.getAttribute("data-index") || "0");
                this.cartItems.splice(index, 1);
                this.openCheckoutModal();
                this.updateCartItemCount();
            });
        });
        // Agregar evento para manejar los botones de cantidad (increase/decrease)
        this.checkoutBody.querySelectorAll(".quantity-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const action = e.target.getAttribute("data-action");
                const itemDiv = e.target.closest(".checkout-product-item");
                const quantitySpan = itemDiv.querySelector("p span");
                let quantity = parseInt(quantitySpan.textContent || "1");
                if (action === "decrease" && quantity > 1) {
                    quantity--;
                }
                else if (action === "increase") {
                    quantity++;
                }
                quantitySpan.textContent = quantity.toString();
                const index = parseInt(itemDiv.getAttribute("data-index") || "0");
                this.cartItems[index].quantity = quantity;
                this.openCheckoutModal(); // Volver a renderizar para reflejar el cambio
                this.updateCartItemCount(); // Actualizar el contador del carrito
            });
        });
    };
    // Método para cerrar la modal de checkout
    closeCheckoutModal = () => {
        this.checkoutModal.style.display = "none";
        this.checkoutBody.innerHTML = "";
    };
    // Método auxiliar para manejar clics fuera de la modal
    handleOutsideClick = (e) => {
        if (e.target === this.checkoutModal) {
            this.closeCheckoutModal();
        }
    };
    // Método para guardar el pedido
    async saveOrder() {
        const userIdString = localStorage.getItem('userId');
        const usuarioId = userIdString ? parseInt(userIdString) : 1; // Fallback a 1 si no hay userId
        // Formatear fecha a YYYY-MM-DD
        const fecha = new Date().toISOString().split('T')[0];
        const order = {
            usuarioId: usuarioId,
            fecha: fecha,
            productos: this.cartItems.map(item => ({
                productos_idproductos: item.product.id,
                cantidad: item.quantity
            }))
        };
        try {
            const response = await fetch("http://localhost:1802/createpedido", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order)
            });
            if (response.ok) {
                alert("Pedido realizado con éxito");
                this.cartItems = [];
                this.closeCheckoutModal();
                this.updateCartItemCount();
            }
            else {
                alert("Error al realizar el pedido");
            }
        }
        catch (error) {
            console.error("Error saving order:", error);
            alert("Error al conectar con el servidor");
        }
    }
}
