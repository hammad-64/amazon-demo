import { cart, removeItemFromCart } from './data/cart.js';
import { products } from './data/products.js';
import { deliveryOptions } from './data/deliveryOptions.js';


let checkoutHTML = '';
cart.forEach((item) => {
    const productId = item.productId;
    
    let matchingProduct;

    products.forEach((product) => {
        
        if(product.id === productId ){
            matchingProduct = product;
        }
            
    });

    const deliveryoptionId = item.deliveryOptionId;

    let deliveryoption;
    deliveryOptions.forEach((option) => {
      if(option.id === deliveryoptionId){
        deliveryoption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryoption.deliveryDays , 'days');
    const datestring = deliveryDate.format('dddd, MMMM D');
    
    checkoutHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${datestring}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${(matchingProduct.priceCents / 100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${item.productQuantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary" data-product-id = ${item.productId}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                  ${deliveryOptionsHTML(matchingProduct , item)}
                </div>
                
              </div>
            </div>
          </div>
    `
});


function deliveryOptionsHTML(matchingProduct , item){
  let HTML = '';
  
  
  deliveryOptions.forEach((deliveryoption) => {

    const today = dayjs();
    const deliveryDate = today.add(deliveryoption.deliveryDays , 'days');
    const datestring = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryoption.price === 0 
      ? 'FREE'
      : `$${((deliveryoption.price) / 100).toFixed(2)} -`

      const isChecked = deliveryoption.id === item.deliveryOptionId;

    HTML += `
      <div class="delivery-option">
                  <input type="radio"
                    ${isChecked ? 'checked' : '' }
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${datestring}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>
    `
  });
  return HTML;
}

document.querySelector('.js-checkout-element')
    .innerHTML = checkoutHTML;

document.querySelectorAll('.delete-quantity-link')
  .forEach((link) => {
    link.addEventListener('click' , () => {
      const productId = link.dataset.productId;
      removeItemFromCart(productId);


      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
    });
  });


