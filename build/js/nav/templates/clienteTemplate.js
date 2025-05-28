export default class ClientModalTemplate {
    constructor() { }
    render(clientData, ordersData) {
        return `
            <div class="client-modal-container">
                <h2>Datos del Cliente</h2>
                <div class="client-info">
                    <p><strong>ID:</strong> ${clientData.id}</p>
                    <p><strong>Nombre:</strong> ${clientData.nombre}</p>
                    <p><strong>Correo:</strong> ${clientData.correo}</p>
                    <p><strong>Teléfono:</strong> ${clientData.telefono}</p>
                    <p><strong>Dirección:</strong> ${clientData.direccion}</p>
                </div>
                <h2>Mis Pedidos</h2>
                <table class="client-orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ordersData.length > 0 ? ordersData.map(order => `
                            <tr data-order-id="${order.id}">
                                <td>${order.id}</td>
                                <td>${order.total.toFixed(2)} €</td>
                                <td>${order.estado}</td>
                                <td>${new Date(order.fecha).toLocaleDateString()}</td>
                                <td><button class="view-invoice-btn" data-order-id="${order.id}">Ver</button></td>
                            </tr>
                        `).join('') : '<tr><td colspan="5">No tienes pedidos.</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }
    renderInvoice(order) {
        return `
            <div class="client-invoice-container">
                <h2>Factura - Pedido #${order.id}</h2>
                <p><strong>Cliente:</strong> ${order.cliente}</p>
                <p><strong>Fecha:</strong> ${new Date(order.fecha).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)} €</p>
                <p><strong>Estado:</strong> ${order.estado}</p>
                <h3>Productos:</h3>
                <table class="client-invoice-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.productos.map(item => `
                            <tr>
                                <td>${item.producto.nombre}</td>
                                <td>${item.cantidad}</td>
                                <td>${item.producto.precio.toFixed(2)} €</td>
                                <td>${(item.producto.precio * item.cantidad).toFixed(2)} €</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button class="client-invoice-back-btn">Regresar</button>
            </div>
        `;
    }
}
