export default class CartModalTemplate {
    static async render(cartItems) {
        if (!cartItems.length) {
            return `<p>Tu carrito está vacío.</p>`;
        }
        let subtotal = 0;
        const itemsHtml = cartItems.map(item => {
            const price = parseFloat(item.product.precio.toString());
            subtotal += price * item.quantity;
            return `
        <div class="cart-item">
          <img src="${item.product.image}" alt="${item.product.nombre}">
          <div class="cart-item-details">
            <h3>${item.product.nombre}</h3>
            <p>Medida: ${item.product.medida}</p>
            <p>Cantidad: <span>${item.quantity}</span> <button class="quantity-btn" data-action="decrease">-</button> <button class="quantity-btn" data-action="increase">+</button></p>
            <p>Precio: ${price.toFixed(2)} €</p>
            <button class="remove-item">×</button>
          </div>
        </div>
      `;
        }).join('');
        return `
      <div class="cart-modal">
        <h2>MI CARRITO (${cartItems.length})</h2>
        ${itemsHtml}
        <div class="cart-total">
          <p>Total a pagar: ${subtotal.toFixed(2)} €</p>
          
        <div class="cart-actions">
          <button id="clear-cart">Ir al carrito</button>
        </div>
      </div>
    `;
    }
}
