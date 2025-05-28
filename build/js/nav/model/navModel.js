export default class NavModel {
    async init() {
        console.log("NavModel initialized");
    }
    async login(data) {
        try {
            const res = await fetch("http://localhost:1802/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return await res.json();
        }
        catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    }
    async register(data) {
        try {
            const res = await fetch("http://localhost:1802/createuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return await res.json();
        }
        catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    }
    async getCliente(userId) {
        try {
            const res = await fetch(`http://localhost:1802/cliente/${userId}`);
            if (!res.ok)
                throw new Error("Error al obtener los datos del cliente");
            return await res.json();
        }
        catch (error) {
            console.error("Error en getCliente:", error);
            throw error;
        }
    }
    async getPedidos(userId) {
        try {
            const res = await fetch(`http://localhost:1802/pedidos/cliente/${userId}`);
            if (!res.ok)
                throw new Error("Error al obtener los pedidos del cliente");
            return await res.json();
        }
        catch (error) {
            console.error("Error en getPedidos:", error);
            throw error;
        }
    }
}
