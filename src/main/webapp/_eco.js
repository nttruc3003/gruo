/* Copyright (c) 2024 Aviado Inc. All rights reserved. */

$(document).ready(function() {
	moeco.clouch();
});


var moeco = new function() {

var pi = this;

var vendor ="";

var productsData =[];

pi.clouch = function() {
	clouch('#moeco button.test1', click);
	clouch('#search-groups button.fetch-products', this.fetchProducts);
	clouch('#vendors button.vendor', click);
	clouch('#productTypes .productType', click);
};

pi.load = function(next) {
	if (next)
		next();
};

pi.render = function(options) {
	/*Load the page at the beginning*/
	var html =
		`<div><button class="test1">Test One</button></div>
		<br>
		
		
		<div class="row ">
            <div class="col-md-2 border-bold" id="search-groups">
                <p>Brands</p><br>
                <div class="row scrollable-window" id="vendors">
                	
                	
                	
            	</div>
            	<button class="fetch-products">Search Products</button>
            </div>
            <div class="col-md-7 border-bold" id = "products-list">
                <div class = "col-md-12 scrollable-window" id="product-container" style="height: 90vh">
                
                    
                    
                </div>
            </div>
            <div class="col-md-3 border-bold cart-div">
                <div id="cart">
                    <p>Show Cart Here</p>
                </div>
            </div>
        </div>
    	`;
	$('#moeco').html(html);
	pi.loadSearchOptions();
	
};
/*Load the data from config.js file*/
pi.loadSearchOptions = function () {
	brandsHtml = ``;
	config.hierarchy.brands.forEach(brand => {
		brandsHtml +=
    	`<div class ="col-md-6">
        	<button class="btn btn-default vendor" data-name="${brand}">
    			<img src="images/DND.png" alt="Icon" style= "max-width: 100%; height: auto;">
    			<p style = "color: Black">${brand}</p>
  			</button>
        </div>`
	});
	$('#vendors').html(brandsHtml);
	
	
	
}

var click = function(target) {
	if ($(target).hasClass('test1')){
		alert("brand: " + vendor)
	}else if ($(target).hasClass('vendor')){
		vendor = $(target).data('name');
	} else if ($(target).hasClass('productType')) {
		$('#productTypes .productType').removeClass('border-bold');
		$(target).addClass('border-bold')
		productType = $(target).data('name');
	}
		
		
};

pi.fetchProducts = function(){
	/*alert('Fetch')*/
	/*const query = `
	{
		products(first: 250, query: "vendor:'${vendor}' AND product_type:'${productType}'") {
	    edges {
	      node {
	        id
	        title
	        descriptionHtml
	        vendor
	        productType
	        variants(first: 1) {
	          edges {
	            node {
	              price{
					  amount
				  }
	            }
	          }
	        }
	        images(first: 1) {
	          edges {
	            node {
	              src
	              altText
	            }
	          }
	        }
	      }
	    }
	  }
	}
	`;*/
	const query = `
		{
		  collections(first: 250) {
		    edges {
		      node {
		        id
		        title
		        
		      }
		    }
		  }
		}
	`;
    const shopifyLink = `https://nail-daily.myshopify.com/api/2024-01/graphql.json`
    /*const shopifyLink = `https://tukanotesting.myshopify.com/api/2024-01/graphql.json`*/
    fetch(shopifyLink, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //Testing Store
            /*'X-Shopify-Storefront-Access-Token': '07b6fad9bbb166417181040e4f2257b1'*/
            //Nail Deli
            'X-Shopify-Storefront-Access-Token': '47e4288ccc74d61c3a4768841e6268c4'
            
        },
        body: JSON.stringify({ query })
    })
    .then(response => response.json())
    .then(data => {
        
        /*productsData = data.data.products.edges*/
        console.log(productsData);
        /*if (Array.isArray(productsData))console.log('True2')
        pi.displayProducts(productsData)*/
    })
    .catch(error => console.error('Error fetching products:', error));
    /*pi.displayProducts(productsData)*/
    
    
};

pi.displayProducts = function(productsData){
	let productsHtml = ''
	productsData.forEach(({node}) => {
		let imgSrc = node.images.edges[0] ? node.images.edges[0].node.src : 'images/DND.png';
		let productPrice = node.variants.edges[0].node.price.amount;
		/*let productTitle = (node.title.length > 64) ? (node.title.slice(0,64) + "...") : node.title;*/
		titleArray = node.title.split(",");
		let productTitle = node.title;
		let colorNum = titleArray[1];
		
		productsHtml +=
		`<div class ="col-md-3 border-light product">
        	<div class= "product-img">
        		<span class="color-number">${colorNum}</span>
        		<img src="${imgSrc}" alt="Icon" >
        	</div>
			<div class= "product-title">
				<p>${productTitle}</p>
			</div>
			<div class= "product-price">
				<h3> ${productPrice} USD</h3>
			</div>
			<div class= "product-function">
				<p>Brand: ${node.vendor}</p>
			</div>
		</div>`;
	});
	$('#product-container').html(productsHtml);
}

}();


