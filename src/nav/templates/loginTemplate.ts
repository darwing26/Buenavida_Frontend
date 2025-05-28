export default class LoginTemplate {
    public static async render(): Promise<string> {
        const html = `
            <h2>Iniciar Sesión</h2>
            <form id="login-form">
                <div class="input-group">
                    
                    <input type="email" name="correo" placeholder="Email" required />
                </div>
                <div class="input-group">
                   
                    <input type="password" name="password" placeholder="Contraseña" required />
                </div>
                <div class="buttons-group">
                <button type="submit">Accede</button>
                <button id="face" >Accede con Facebook</button>
                </div>
                <p class="forgot-password">¿Has olvidado tu contraseña?</p>
            </form>`;
        console.log("LoginTemplate render:", html);
        return html;
    }
}