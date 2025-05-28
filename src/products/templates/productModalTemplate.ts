import Product from "../types/product";

export default class ProductModalTemplate {
  public static async render(product: Product): Promise<string> {
    const userId = Number(localStorage.getItem("userId"));

    const res = await fetch(`http://localhost:1802/favoritos/${userId}`);
    const favoritos = await res.json();

    const esFavorito = favoritos.some((fav: any) => fav.idproductos === product.id);

    const corazon = esFavorito
      ? `<span class="heart-icon favorite" data-fav="true" data-id="${product.id}">❤️</span>`
      : `<span class="heart-icon" data-fav="false" data-id="${product.id}">🤍</span>`;

    return `
      <div class="modal-product">
        <div class="left">
          <img src="${product.image}" alt="${product.nombre}">
        </div>
        <div class="right">
          <h2>
            ${product.nombre}
            ${corazon}
          </h2>
          <p class="modal-quantity">${product.medida}</p>
          <p class="modal-price">${product.precio.toFixed(2)} €</p>
          <p class="modal-brand">${product.salea}</p>
          <p class="modal-description">${product.descripcion}</p>
          <div class="modal-actions">
            <div class="quantity-selector">
              <button class="quantity-btn" id="decrease">-</button>
              <input type="text" value="1" readonly>
              <button class="quantity-btn" id="increase">+</button>
            </div>
            <button class="add-to-cart"><i class="fas fa-shopping-basket"></i> Añadir a la cesta</button>
          </div>
        </div>
      </div>
    `;
  }

  // Nueva función para activar eventos del corazón
  public static activateFavoriteListener() {

    console.log("Buscar corazón " );
    const icon = document.querySelector(".heart-icon") as HTMLElement;
    console.log("Corazón encontrado: ", icon);
    if (!icon) return;
    icon.addEventListener("click", async () => {
      console.log("Corazón clicado");
      const idProducto = parseInt(icon.getAttribute("data-id")!);
      const userId = Number(localStorage.getItem("userId"));
      const esFavorito = icon.getAttribute("data-fav") === "true";

      const payload = {
        idUsuario: userId,
        idProducto: idProducto
      };

      try {
        if (esFavorito) {
          await fetch("http://localhost:1802/favorito", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
          icon.textContent = "🤍";
          icon.setAttribute("data-fav", "false");
          icon.classList.remove("favorite");
        } else {
          await fetch("http://localhost:1802/favorito", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
          icon.textContent = "❤️";
          icon.setAttribute("data-fav", "true");
          icon.classList.add("favorite");
        }
      } catch (error) {
        console.error("Error al actualizar favorito:", error);
      }
    });
  }
}
