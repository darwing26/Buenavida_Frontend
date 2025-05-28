import LoginTemplate from "../templates/loginTemplate.js";
import RegisterTemplate from "../templates/registerTemplate.js";
import ClientModalTemplate from "../templates/clienteTemplate.js";
export default class NavView {
    subject;
    selector;
    selectorName = "nav";
    loginModal = null;
    registerModal = null;
    clientModal = null;
    loginModalBody = null;
    registerModalBody = null;
    clientModalBody = null;
    miCuentaMenu = null;
    clientModalTemplate;
    constructor(subject) {
        this.subject = subject;
        this.selector = document.createElement("nav");
        this.clientModalTemplate = new ClientModalTemplate();
    }
    init() {
        this.selector = document.querySelector(this.selectorName);
        if (!this.selector) {
            console.error(`Element with selector ${this.selectorName} not found`);
            return;
        }
        // Inicializar modals
        this.loginModal = document.querySelector("#login-modal");
        this.registerModal = document.querySelector("#register-modal");
        this.clientModal = document.querySelector("#client-modal");
        this.loginModalBody = document.querySelector("#login-body");
        this.registerModalBody = document.querySelector("#register-body");
        this.clientModalBody = document.querySelector("#client-body");
        if (!this.loginModal || !this.registerModal || !this.loginModalBody || !this.registerModalBody) {
            console.error("No se encontraron los elementos de los modals de login/register.");
            return;
        }
        if (!this.clientModal || !this.clientModalBody) {
            console.error("No se encontraron los elementos del modal de cliente.");
            return;
        }
        // Configurar eventos de cierre para los modals
        const closeLoginBtn = this.loginModal.querySelector(".close-btn-login");
        const closeRegisterBtn = this.registerModal.querySelector(".close-btn-register");
        const closeClientBtn = this.clientModal.querySelector(".close-btn-client");
        closeLoginBtn?.addEventListener("click", () => this.closeModal(this.loginModal));
        closeRegisterBtn?.addEventListener("click", () => this.closeModal(this.registerModal));
        closeClientBtn?.addEventListener("click", () => this.closeModal(this.clientModal));
        this.loginModal.addEventListener("click", (e) => {
            if (e.target === this.loginModal)
                this.closeModal(this.loginModal);
        });
        this.registerModal.addEventListener("click", (e) => {
            if (e.target === this.registerModal)
                this.closeModal(this.registerModal);
        });
        this.clientModal.addEventListener("click", (e) => {
            if (e.target === this.clientModal)
                this.closeModal(this.clientModal);
        });
        console.log(this.subject);
        this.setupMiCuentaMenu();
    }
    setupMiCuentaMenu() {
        const miCuentaBtn = document.getElementById("mi-cuenta-btn");
        if (!miCuentaBtn) {
            console.error("Botón 'Mi Cuenta' no encontrado");
            return;
        }
        // Crear o actualizar el menú
        this.updateMiCuentaMenu();
        // Posicionar y alternar el menú
        miCuentaBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            if (this.miCuentaMenu) {
                const rect = miCuentaBtn.getBoundingClientRect();
                this.miCuentaMenu.style.top = `${rect.bottom + window.scrollY}px`;
                this.miCuentaMenu.style.left = `${rect.left + window.scrollX}px`;
                this.miCuentaMenu.style.display = this.miCuentaMenu.style.display === "none" ? "block" : "none";
            }
        });
        // Cerrar el menú si se hace clic afuera
        window.addEventListener("click", () => {
            if (this.miCuentaMenu) {
                this.miCuentaMenu.style.display = "none";
            }
        });
        // Evitar que el menú se cierre si se hace clic dentro de él
        if (this.miCuentaMenu) {
            this.miCuentaMenu.addEventListener("click", (e) => e.stopPropagation());
        }
    }
    updateMiCuentaMenu() {
        const { userId } = this.getUserData();
        const isLoggedIn = !!userId;
        // Crear o actualizar el menú
        if (!this.miCuentaMenu) {
            this.miCuentaMenu = document.createElement("div");
            this.miCuentaMenu.classList.add("mi-cuenta-menu");
            this.miCuentaMenu.style.display = "none";
            this.miCuentaMenu.style.position = "absolute";
            this.miCuentaMenu.style.background = "#fff";
            this.miCuentaMenu.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
            this.miCuentaMenu.style.padding = "10px";
            this.miCuentaMenu.style.borderRadius = "5px";
            this.miCuentaMenu.style.zIndex = "1000";
            document.body.appendChild(this.miCuentaMenu);
        }
        // Generar contenido del menú según el estado de login
        this.miCuentaMenu.innerHTML = `
            <ul>
                <li data-action="my-account"><i class="fas fa-user"></i> Mi Cuenta</li>
                <li data-action="favorites"><i class="far fa-heart"></i> Mis Favoritos</li>
                <li data-action="cart"><i class="fas fa-shopping-cart"></i> Mi Carrito</li>
                ${isLoggedIn
            ? '<li data-action="logout"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</li>'
            : '<li data-action="login"><i class="fas fa-sign-in-alt"></i> Entrar</li>'}
                <li data-action="register"><i class="fas fa-user-plus"></i> Crear una Cuenta</li>
            </ul>
        `;
        console.log("Mi Cuenta menu updated:", this.miCuentaMenu);
        // Añadir eventos a las opciones del menú
        this.miCuentaMenu.querySelectorAll("li").forEach((item) => {
            item.addEventListener("click", () => {
                const action = item.getAttribute("data-action");
                this.handleMenuAction(action);
                if (this.miCuentaMenu) {
                    this.miCuentaMenu.style.display = "none"; // Cerrar el menú después de seleccionar
                }
            });
        });
    }
    handleMenuAction = async (action) => {
        switch (action) {
            case "my-account":
                console.log("Navegar a Mi Cuenta");
                await this.showClientModal();
                break;
            case "favorites":
                console.log("Navegar a Mis Favoritos");
                break;
            case "cart":
                console.log("Navegar a Mi Carrito");
                break;
            case "login":
                if (this.loginModal && this.loginModalBody) {
                    const loginContent = await LoginTemplate.render();
                    this.loginModalBody.innerHTML = loginContent;
                    this.loginModal.style.display = "flex";
                    // Añadir evento al formulario de login
                    const loginForm = this.loginModalBody.querySelector("#login-form");
                    if (loginForm) {
                        loginForm.addEventListener("submit", async (e) => {
                            e.preventDefault();
                            const formData = new FormData(loginForm);
                            const loginData = {
                                correo: formData.get("correo"),
                                password: formData.get("password"),
                            };
                            try {
                                const response = await this.subject.login(loginData);
                                console.log("Login response:", response);
                                // Verificar si el login fue exitoso
                                if (response.message === "Inicio de sesión exitoso" && response.data && response.data.id && response.data.jwt) {
                                    // Guardar id y jwt en localStorage
                                    localStorage.setItem("userId", response.data.id.toString());
                                    localStorage.setItem("jwt", response.data.jwt);
                                    console.log("User ID and JWT stored in localStorage");
                                    // Actualizar el menú para mostrar "Cerrar Sesión"
                                    this.updateMiCuentaMenu();
                                    if (this.loginModalBody == null)
                                        return;
                                    this.showMessage(this.loginModalBody, "Inicio de sesión exitoso", "success");
                                    // Retrasar el cierre del modal para que el mensaje sea visible
                                    setTimeout(() => {
                                        this.closeModal(this.loginModal);
                                    }, 3000);
                                }
                                else {
                                    // Manejar respuesta de login fallida
                                    if (this.loginModalBody == null)
                                        return;
                                    this.showMessage(this.loginModalBody, response.message || "Error al iniciar sesión. Verifica tus credenciales.", "error");
                                }
                            }
                            catch (error) {
                                console.error("Error al iniciar sesión:", error);
                                if (this.loginModalBody == null)
                                    return;
                                this.showMessage(this.loginModalBody, error.message || "Error al iniciar sesión. Verifica tus credenciales.", "error");
                            }
                        });
                    }
                }
                else {
                    console.error("Login modal or body not found");
                }
                break;
            case "register":
                if (this.registerModal && this.registerModalBody) {
                    const registerContent = await RegisterTemplate.render();
                    this.registerModalBody.innerHTML = registerContent;
                    this.registerModal.style.display = "flex";
                    // Añadir evento al formulario de registro
                    const registerForm = this.registerModalBody.querySelector("#register-form");
                    if (registerForm) {
                        registerForm.addEventListener("submit", async (e) => {
                            e.preventDefault();
                            const formData = new FormData(registerForm);
                            const userData = {
                                nombre: formData.get("nombre"),
                                correo: formData.get("correo"),
                                password: formData.get("password"),
                                telefono: formData.get("telefono"),
                                direccion: formData.get("direccion"),
                            };
                            try {
                                const response = await this.subject.register(userData);
                                console.log("Register response:", response);
                                if (this.registerModalBody == null)
                                    return;
                                this.showMessage(this.registerModalBody, "Usuario registrado con éxito", "success");
                                this.closeModal(this.registerModal);
                            }
                            catch (error) {
                                console.error("Error al registrar usuario:", error);
                                if (this.registerModalBody == null)
                                    return;
                                this.showMessage(this.registerModalBody, "Error al registrar usuario. Intenta de nuevo.", "error");
                            }
                        });
                    }
                }
                else {
                    console.error("Register modal or body not found");
                }
                break;
            case "logout":
                // Limpiar localStorage y actualizar el menú
                localStorage.removeItem("userId");
                localStorage.removeItem("jwt");
                console.log("User logged out, localStorage cleared");
                this.updateMiCuentaMenu();
                if (this.loginModalBody) {
                    this.showMessage(this.loginModalBody, "Sesión cerrada con éxito", "success");
                }
                break;
            default:
                console.log("Opción no reconocida");
        }
    };
    async showClientModal() {
        const { userId } = this.getUserData();
        if (!userId) {
            this.showMessage(document.body, "Debes iniciar sesión para ver tu cuenta", "error");
            return;
        }
        if (!this.clientModal || !this.clientModalBody) {
            console.error("Client modal or body not found");
            return;
        }
        try {
            // Mostrar loading
            this.clientModalBody.innerHTML = '<div class="loading">Cargando datos del cliente...</div>';
            this.clientModal.style.display = "flex";
            // Obtener datos del cliente y pedidos en paralelo
            const [clientData, ordersData] = await Promise.all([
                this.subject.getCliente(userId),
                this.subject.getPedidos(userId)
            ]);
            // Mapear los datos del cliente (el endpoint retorna "precio" pero es teléfono)
            const mappedClientData = {
                id: clientData.id,
                nombre: clientData.nombre,
                correo: clientData.correo,
                telefono: clientData.precio, // El campo "precio" es en realidad el teléfono
                direccion: clientData.direccion
            };
            // Renderizar el modal con los datos
            const clientContent = this.clientModalTemplate.render(mappedClientData, ordersData);
            this.clientModalBody.innerHTML = clientContent;
            // Añadir eventos a los botones "Ver" de la tabla
            this.setupClientModalEvents(ordersData);
        }
        catch (error) {
            console.error('Error al cargar los datos del cliente:', error);
            if (this.clientModalBody) {
                this.clientModalBody.innerHTML = '<div class="error">Error al cargar la información del cliente</div>';
            }
        }
    }
    setupClientModalEvents(ordersData) {
        if (!this.clientModalBody)
            return;
        // Añadir eventos a los botones "Ver"
        const viewButtons = this.clientModalBody.querySelectorAll('.view-invoice-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = parseInt(e.target.getAttribute('data-order-id') || '0');
                this.showInvoice(orderId, ordersData);
            });
        });
    }
    showInvoice(orderId, ordersData) {
        if (!this.clientModalBody)
            return;
        // Buscar el pedido específico
        const order = ordersData.find(o => o.id === orderId);
        if (!order) {
            this.showMessage(this.clientModalBody, 'No se encontró el pedido', 'error');
            return;
        }
        // Renderizar la factura
        const invoiceContent = this.clientModalTemplate.renderInvoice(order);
        this.clientModalBody.innerHTML = invoiceContent;
        // Añadir evento al botón "Volver"
        const backButton = this.clientModalBody.querySelector('.client-invoice-back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.showClientModal(); // Volver a mostrar el modal principal
            });
        }
    }
    // Método para obtener los datos del usuario desde localStorage
    getUserData() {
        const userId = localStorage.getItem("userId");
        const jwt = localStorage.getItem("jwt");
        return { userId, jwt };
    }
    showMessage = (container, message, type) => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.marginTop = "10px";
        messageDiv.style.padding = "10px";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.color = "white";
        messageDiv.style.backgroundColor = type === "success" ? "#5ccb5f" : "#e74c3c";
        container.appendChild(messageDiv);
        // Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    };
    closeModal = (modal) => {
        if (modal) {
            modal.style.display = "none";
            const modalBody = modal.querySelector(".modal-content > div");
            if (modalBody) {
                // Limpiar el contenido del modal al cerrarlo
                modalBody.innerHTML = "";
            }
        }
    };
    render() {
        console.log("NavView render method called");
    }
}
