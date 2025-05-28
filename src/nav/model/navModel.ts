export default class NavModel {
    public async init(): Promise<void> {
        console.log("NavModel initialized");
    }

    public async login(data: { correo: string; password: string }): Promise<any> {
        try {
            const res = await fetch("http://localhost:1802/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return await res.json();
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    }

    public async register(data: {
        nombre: string;
        correo: string;
        password: string;
        telefono: string;
        direccion: string;
    }): Promise<any> {
        try {
            const res = await fetch("http://localhost:1802/createuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return await res.json();
        } catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    }

    public async getCliente(userId: string): Promise<any> {
        try {
            const res = await fetch(`http://localhost:1802/cliente/${userId}`);
            if (!res.ok) throw new Error("Error al obtener los datos del cliente");
            return await res.json();
        } catch (error) {
            console.error("Error en getCliente:", error);
            throw error;
        }
    }

    public async getPedidos(userId: string): Promise<any[]> {
        try {
            const res = await fetch(`http://localhost:1802/pedidos/cliente/${userId}`);
            if (!res.ok) throw new Error("Error al obtener los pedidos del cliente");
            return await res.json();
        } catch (error) {
            console.error("Error en getPedidos:", error);
            throw error;
        }
    }
}