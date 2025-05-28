import Product from "../types/product.js";

export default class ProductsModel {
    private products: Product[] = [];
    private totalPages: number = 0;
    private totalProducts: number = 0;
    private currentPage: number = 1;
    private readonly productsPerPage: number = 12;
    
    // Estados para filtros y búsqueda
    private currentSearchTerm: string = "";
    private currentMinPrice: number = 0;
    private currentMaxPrice: number = 100;
    private isFiltering: boolean = false;
    private isSearching: boolean = false;
    private showingFavorites: boolean = false;
    private currentUserId: number | null = null;

    public async init(page: number = 1): Promise<void> {
        this.currentPage = page;
        await this.fetchProducts(page);
        console.log('ProductsModel initialized and products fetched');
        console.log('Products:', this.products);
        console.log('Total Pages:', this.totalPages);
    }

    public async fetchProducts(page: number): Promise<Product[]> {
        try {
            let url = '';
            let isArrayResponse = false;
            
            // Determinar qué endpoint usar basado en el estado actual
            if (this.showingFavorites && this.currentUserId) {
                url = `http://localhost:1802/favoritos/${this.currentUserId}`;
                isArrayResponse = true;
            } else if (this.isSearching && this.currentSearchTerm) {
                url = `http://localhost:1802/searchproduct/${encodeURIComponent(this.currentSearchTerm)}`;
                isArrayResponse = true;
            } else if (this.isFiltering) {
                url = `http://localhost:1802/filterbyprice/${this.currentMinPrice}/${this.currentMaxPrice}`;
                isArrayResponse = true;
            } else {
                url = `http://localhost:1802/pagination/${page}`;
                isArrayResponse = false;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Data received from endpoint:', data);

            // Manejar la respuesta según el tipo de endpoint
            if (isArrayResponse && Array.isArray(data)) {
                // Para búsqueda, filtros y favoritos que devuelven array directo
                this.calculatePaginationFromArray(data, page);
            } else {
                // Para paginación normal que devuelve objeto con paginación O array de productos
                if (Array.isArray(data)) {
                    // Si el endpoint de paginación devuelve solo array, asumir que hay más páginas
                    this.products = data;
                    // Asumir que hay al menos 5 páginas como mencionaste en los requerimientos
                    this.totalPages = 5;
                    this.totalProducts = this.totalPages * this.productsPerPage;
                } else {
                    // Si devuelve objeto con información de paginación
                    this.products = data.products || data || [];
                    this.updatePaginationInfo(data);
                }
            }
            
            this.currentPage = page;
            return this.products;
        } catch (error) {
            console.error('Error fetching products:', error);
            this.products = [];
            this.totalPages = 0;
            this.totalProducts = 0;
            return [];
        }
    }

    private calculatePaginationFromArray(allProducts: Product[], currentPage: number): void {
        this.totalProducts = allProducts.length;
        this.totalPages = Math.ceil(this.totalProducts / this.productsPerPage);
        
        // Calcular productos para la página actual
        const startIndex = (currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        this.products = allProducts.slice(startIndex, endIndex);
    }

    private updatePaginationInfo(data: any): void {
        if (data.totalProducts) {
            this.totalProducts = data.totalProducts;
            this.totalPages = Math.ceil(this.totalProducts / this.productsPerPage);
        } else if (data.totalPages) {
            this.totalPages = data.totalPages;
            this.totalProducts = data.totalPages * this.productsPerPage;
        } else {
            // Si no hay información de paginación, asumir múltiples páginas disponibles
            // como mencionaste en los requerimientos (hasta 5 páginas por defecto)
            this.totalPages = 5;
            this.totalProducts = this.totalPages * this.productsPerPage;
        }
    }

    // Método para búsqueda
    public async searchProducts(searchTerm: string, page: number = 1): Promise<Product[]> {
        this.currentSearchTerm = searchTerm.trim();
        this.isSearching = this.currentSearchTerm.length > 0;
        this.isFiltering = false;
        this.showingFavorites = false;
        this.currentPage = page;
        
        if (this.isSearching) {
            try {
                const response = await fetch(`http://localhost:1802/searchproduct/${encodeURIComponent(this.currentSearchTerm)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const allProducts = await response.json();
                this.calculatePaginationFromArray(allProducts, page);
                return this.products;
            } catch (error) {
                console.error('Error searching products:', error);
                this.products = [];
                this.totalPages = 0;
                return [];
            }
        } else {
            return await this.fetchProducts(page);
        }
    }

    // Método para filtrar por precio
    public async filterByPrice(minPrice: number, maxPrice: number, page: number = 1): Promise<Product[]> {
        this.currentMinPrice = minPrice;
        this.currentMaxPrice = maxPrice;
        this.isFiltering = true;
        this.isSearching = false;
        this.showingFavorites = false;
        this.currentPage = page;
        
        try {
            const response = await fetch(`http://localhost:1802/filterbyprice/${minPrice}/${maxPrice}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const allProducts = await response.json();
            this.calculatePaginationFromArray(allProducts, page);
            return this.products;
        } catch (error) {
            console.error('Error filtering products:', error);
            this.products = [];
            this.totalPages = 0;
            return [];
        }
    }

    // Método para obtener favoritos
    public async getFavorites(page: number = 1): Promise<Product[]> {
    const userIdString = localStorage.getItem('userId');
    this.currentUserId = userIdString ? parseInt(userIdString) : null;
    this.showingFavorites = true;
    this.isSearching = false;
    this.isFiltering = false;
    this.currentPage = page;

    try {
        let response;

        if (this.currentUserId === null) {
            // Si no hay usuario, obtener producto por defecto
            response = await fetch('http://localhost:1802/favoritos/0');
        } else {
            // Obtener favoritos del usuario
            response = await fetch(`http://localhost:1802/favoritos/${this.currentUserId}`);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const allProducts = Array.isArray(data) ? data : [data]; // Asegura que sea un array

        this.calculatePaginationFromArray(allProducts, page);
        return this.products;
    } catch (error) {
        console.error('Error fetching favorites or default product:', error);
        this.products = [];
        this.totalPages = 0;
        return [];
    }
}


    // Método para limpiar filtros y volver a la vista normal
    public async clearFilters(page: number = 1): Promise<Product[]> {
        this.isSearching = false;
        this.isFiltering = false;
        this.showingFavorites = false;
        this.currentSearchTerm = "";
        this.currentMinPrice = 0;
        this.currentMaxPrice = 100;
        this.currentUserId = null;
        this.currentPage = page;
        
        return await this.fetchProducts(page);
    }

    // Getters existentes
    public getProducts(): Product[] {
        return this.products;
    }

    public getTotalPages(): number {
        return this.totalPages;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    // Nuevos getters para el estado
    public getCurrentState(): {
        isSearching: boolean;
        isFiltering: boolean;
        showingFavorites: boolean;
        searchTerm: string;
        minPrice: number;
        maxPrice: number;
        userId: number | null;
    } {
        return {
            isSearching: this.isSearching,
            isFiltering: this.isFiltering,
            showingFavorites: this.showingFavorites,
            searchTerm: this.currentSearchTerm,
            minPrice: this.currentMinPrice,
            maxPrice: this.currentMaxPrice,
            userId: this.currentUserId
        };
    }
}