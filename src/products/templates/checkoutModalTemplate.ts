import Product from "../types/product.js";

export default class CheckoutModalTemplate {
  public static async render(cartItems: { product: Product; quantity: number }[]): Promise<string> {
    if (!cartItems.length) {
      return `<p>No hay ítems para procesar.</p>`;
    }

    let subtotal = 0;
    const itemsHtml = cartItems.map((item, index) => {
      const price = parseFloat(item.product.precio.toString());
      subtotal += price * item.quantity;
      return `
        <div class="checkout-product-item" data-index="${index}">
          <img src="${item.product.image}" alt="${item.product.nombre}" style="width: 50px; height: auto;">
          <div class="checkout-product-details">
            <h3>${item.product.nombre}</h3>
            <p>Medida: ${item.product.medida}</p>
            <p>Cantidad: <span>${item.quantity}</span> <button class="quantity-btn" data-action="decrease">-</button> <button class="quantity-btn" data-action="increase">+</button></p>
            <p>Precio: ${price.toFixed(2)} €</p>
            <button class="checkout-remove-item">×</button>
          </div>
        </div>
      `;
    }).join('');

    const total = subtotal;
    const freeShippingThreshold = 45.00;
    const shippingRemaining = freeShippingThreshold - subtotal;

    return `
      <div class="checkout-content-container">
        <div class="checkout-items-list">
          <h2>Esta es tu cesta de la compra</h2>
          <p>${cartItems.length} Artículo${cartItems.length === 1 ? '' : 's'}:</p>
          ${itemsHtml}
        </div>
        <div class="checkout-order-summary">
          <h3>Resumen de tu pedido:</h3>
          <p>Subtotal de tu pedido: ${subtotal.toFixed(2)} €</p>
          <p>TOTAL: ${total.toFixed(2)} € (Envío no incluido)</p>
          ${subtotal < freeShippingThreshold ? `<p>Te faltan ${shippingRemaining.toFixed(2)} € para disfrutar del envío gratuito.</p>` : ''}
          <button id="submit-order">Realizar pedido</button>
         
        </div>
      </div>
    `;
  }
}