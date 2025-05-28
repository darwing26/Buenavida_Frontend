export default class ProductBoxTemplate {
    // Método para obtener los favoritos del usuario
    static async fetchUserFavorites() {
        try {
            const userId = localStorage.getItem('userId');
            console.log('UserID desde localStorage:', userId);
            if (!userId) {
                console.warn('Usuario no logueado');
                return [];
            }
            const url = `http://localhost:1802/favoritos/${userId}`;
            console.log('Consultando favoritos en:', url);
            const response = await fetch(url);
            if (response.ok) {
                const favoriteProducts = await response.json();
                console.log('Favoritos obtenidos:', favoriteProducts);
                // Extraer solo los IDs de productos
                const favoriteIds = favoriteProducts.map((fav) => fav.idproductos);
                console.log('IDs de favoritos:', favoriteIds);
                return favoriteIds;
            }
            else {
                console.error('Error al obtener favoritos:', response.status, response.statusText);
                return [];
            }
        }
        catch (error) {
            console.error('Error al cargar favoritos:', error);
            return [];
        }
    }
    // Método para alternar favorito (agregar/quitar)
    static async toggleFavorite(productId, heartElement) {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Debes iniciar sesión para agregar favoritos');
                return;
            }
            // Obtener favoritos actuales
            const currentFavorites = await this.fetchUserFavorites();
            const isFavorite = currentFavorites.includes(productId);
            const method = isFavorite ? 'DELETE' : 'POST';
            const url = `http://localhost:1802/favoritos/${userId}/${productId}`;
            console.log(`${method} favorito en:`, url);
            const response = await fetch(url, { method });
            if (response.ok) {
                // Actualizar el ícono del corazón inmediatamente
                const newIsFavorite = !isFavorite;
                heartElement.innerHTML = newIsFavorite ? '❤️' : '🤍';
                heartElement.classList.toggle('favorite', newIsFavorite);
                heartElement.classList.toggle('not-favorite', !newIsFavorite);
                console.log(`Favorito ${newIsFavorite ? 'agregado' : 'removido'} exitosamente`);
            }
            else {
                console.error('Error al actualizar favorito:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error al procesar favorito:', error);
        }
    }
    static async render(product) {
        // Obtener favoritos del usuario
        const favoriteIds = await this.fetchUserFavorites();
        console.log(`Renderizando producto ${product.id}`);
        console.log('Lista de favoritos:', favoriteIds);
        // Determinar si el producto tiene descuento (mayor a 0)
        const hasDiscount = product.descuento !== undefined && product.descuento !== null && product.descuento > 0;
        const discountLabel = hasDiscount ? `<span class="discount-label">-${product.descuento}%</span>` : "";
        // Verificar si el producto está en favoritos
        const isFavorite = favoriteIds.includes(product.id);
        const heartIcon = isFavorite ? '❤️' : '🤍';
        const heartClass = isFavorite ? 'favorite' : 'not-favorite';
        console.log(`Producto ${product.id} es favorito: ${isFavorite}`);
        return `<div class="product-card" data-product-id="${product.id}">
            <div class="product-card-inner">
                ${discountLabel} <!-- Etiqueta de descuento solo si aplica -->
                <div class="favorite-heart ${heartClass}" data-product-id="${product.id}">
                    ${heartIcon}
                </div>
                <img src="${product.image}" alt="Producto">
                <h3 class="product-title">${product.nombre}</h3>
                <p class="product-brand">${product.salea.replace("Sale a: ", "").trim()}</p>
                <p class="product-price">${product.precio.toFixed(2)} €</p>
                <button class="add-to-cart-btn"><i class="fas fa-shopping-basket"></i> Añadir a la cesta</button>
            </div>
        </div>`;
    }
    // Método para inicializar los event listeners después de renderizar
    static initializeFavoriteListeners() {
        // Remover listeners anteriores para evitar duplicados
        document.removeEventListener('click', this.handleFavoriteClick);
        document.addEventListener('click', this.handleFavoriteClick.bind(this));
    }
    static handleFavoriteClick(event) {
        const target = event.target;
        if (target.classList.contains('favorite-heart')) {
            const productId = parseInt(target.getAttribute('data-product-id') || '0');
            if (productId > 0) {
                ProductBoxTemplate.toggleFavorite(productId, target);
            }
        }
    }
}
