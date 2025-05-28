export default class RegisterTemplate {
    static async render() {
        const html = `
            <h2>Crear Cuenta</h2>
            <form id="register-form">
            <p>Datos personales</p>
                <input type="text" name="nombre" placeholder="Nombre completo" required />
                <input type="number" name="telefono" placeholder="Teléfono" required />
                <input type="text" name="direccion" placeholder="Dirección" required />
            <p>Información de inicio de sesión</p>
                <input type="email" name="correo" placeholder="Correo electrónico" required />
                <input type="password" name="password" placeholder="Contraseña" required />
                
                <button type="submit">Registrarse</button>
            </form>`;
        console.log("RegisterTemplate render:", html);
        return html;
    }
}
