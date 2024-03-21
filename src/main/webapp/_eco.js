/* Copyright (c) 2024 Aviado Inc. All rights reserved. */

$(document).ready(function() {
	moeco.clouch();
});


var moeco = new function() {

var pi = this;

var vendor = '';


var ticket ;

const brandsDict = {};

const collectionDict = {};

const shopifyLink = `https://nail-daily.myshopify.com/api/2024-01/graphql.json`;
//					 `https://tukanotesting.myshopify.com/api/2024-01/graphql.json`;
const token = 
//			'07b6fad9bbb166417181040e4f2257b1';
            //Nail Deli
            '47e4288ccc74d61c3a4768841e6268c4';

pi.clouch = function() {
	clouch('#moeco button.test1', click);
	pi.fetchCollections().then(()=> {
		let colList = [];
		const brandKeys = Object.keys(brandsDict);
		for(let i = 0; i < brandKeys.length; i++){
//			console.log(brandKeys[i], colList);
			if (colList.length <50) {
				colList = colList.concat(brandsDict[brandKeys[i]].collections);
			} else break;
			
		};
		
		pi.displayCollection(colList);
	}).catch(error => {
		console.error('Error in fetching collections:', error);
	});
	clouch('#vendors .brand', click);
	clouch('#display-container .collection', click);
	clouch('.colored-product', click);
	clouch('.special-product', click);
	clouch('.quantity-btn', click);
	clouch('.add-to-cart', click);
	
};

pi.load = function(next) {
	if (next)
		next();
};

pi.render = function(options) {
	/*Load the page at the beginning*/
	
	var html =
		`<div class="row ">
            <div class="col-md-2 border-bold" id="search-groups">
                <p>Brands</p><br>
                <div class="row scrollable-window" id="vendors">
                	
                	
                	
            	</div>
            	<div><button class="test1">Test One</button></div>
            </div>
            <div class="col-md-7 border-bold" id = "display-container">
                <div class = "col-md-12 scrollable-window" id="collection-container" style="height: 90vh">
                
                    
                    
                </div>
            </div>
            <div class="col-md-3 border-bold cart-div">
                <div id="cart">
                	<p>#0001<p>
                	<div class ="scrollable-window ticket-collections">
                	</div>
                	<div class ="ticket-total-price">
                	</div>
                </div>
            </div>
        </div>
    	`;
	$('#moeco').html(html);
	
	pi.loadSearchOptions();
	ticket = config.ticket;
	pi.displayTicket();
	
};

pi.displayTicket = function() {
	
};
/*Load the data from config.js file*/
pi.loadSearchOptions = function () {
	brandsHtml = ``;
	config.hierarchy.brands.forEach(brand => {
		brandsHtml +=
    	`<div class ="col-md-6 brand" data-name="${brand}">
			<img src="images/DND.png" alt="Icon" style= "max-width: 100%; height: auto;">
			<p style = "color: Black">${brand}</p>
        </div>`
	});
	$('#vendors').html(brandsHtml);

	
	
	
};

var click = function(target) {
	if ($(target).hasClass('test1')){
		console.log(collectionDict);
		
	}else if ($(target).hasClass('brand')){
		vendor = $(target).data('name');
		$('#vendors .brand').removeClass('border-light');
		$(target).addClass('border-light');
		
		if (brandsDict[vendor] && brandsDict[vendor].collections) {
			pi.displayCollection(brandsDict[vendor].collections);
		} else {
			console.error('Fail to fetch collections.')
		};
	} else if ($(target).hasClass('collection')) {
		let collectionId = $(target).data('name');
		pi.fetchProducts(collectionId).then(()=> {
			pi.displayProducts(collectionId);
		}).catch(error => {
			console.error('Error in fetching products:', error);
		});
	}else if ($(target).hasClass('colored-product') || $(target).hasClass('special-product')){
		$('.colored-product').removeClass('border-light');
		$('.special-product').removeClass('border-light');
		$(target).addClass('border-light');
		let collectionID = $(target).data('collection');
		let productIndex = $(target).data('index');
		pi.updateProInfo(collectionID, productIndex);
		
	}else if ($(target).hasClass('quantity-btn')){
		if ($(target).hasClass('plus')) {
			pi.changeQuantity(1);
		} else if($(target).hasClass('minus')) {
			pi.changeQuantity(-1);
		};
		
	}else if ($(target).hasClass('add-to-cart')){
		pi.addToCart();
	}
		
		
};

pi.fetchCollections = function(){
	return new Promise((resolve, reject) => {
		const query = `
			{
			  collections(first: 10) {
			    edges {
			      cursor
			      node {
			        id
			        handle
			        title
			        image {
			          src
			          altText
			        }
			        metafields(identifiers: [{namespace: "custom", key: "brand"}, {namespace: "custom", key: "color_number_index"}]) {
			          key
			          namespace
			          value
			          id
			        }
			      }
			    }
			    pageInfo {
			      hasNextPage
			      hasPreviousPage
			    }
			  }
			}
		`;
	
	    fetch(shopifyLink, {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json',
	            'X-Shopify-Storefront-Access-Token': token
	            
	        },
	        body: JSON.stringify({ query })
	    })
	    .then(response => response.json())
	    .then(data => {
	        let collectionsArray = data.data.collections.edges;
	        collectionsArray.forEach(collection => {
				 
				 if (collection.node.metafields && collection.node.metafields.length > 0) {
					 let metafields = collection.node.metafields;
					 let brand = metafields[0]?metafields[0].value : "";
					 if (!brandsDict[brand]) {
						 
						 brandsDict[brand]= {
							"collections":[], 
						 	"nameIndex": metafields[1]?metafields[1].value :''};
					 };
					 brandsDict[brand].collections.push(collection);
				 }
			});
			
			resolve();
			
	    })
	    .catch(error => {
			console.error('Error fetching collections:', error);
			reject(error);
		})
	});

    
};

pi.displayCollection = function(collections){
	let collectionFrames = `
	<div class = "col-md-12 scrollable-window" id="collection-container" style="height: 90vh">                
    </div>`;
    $('#display-container').html(collectionFrames);
	let collectionsHtml = ''
	collections.forEach(collection => {
		const node = collection.node;
		let imgSrc = node.image? node.image.src : 'images/DND.png';
//		let productPrice = node.variants.edges[0].node.price.amount;
		/*let productTitle = (node.title.length > 64) ? (node.title.slice(0,64) + "...") : node.title;*/
//		titleArray = node.title.split(",");
		let collectionTitle = node.title;
//		let colorNum = titleArray[1];
		let collectionID = node.id;
		let brand = node.metafields[0]? node.metafields[0].value : "";
		
		collectionsHtml +=
		`<div class ="col-md-3 border-light collection" data-name="${collectionID}">
        	<div class= "collection-img">
        		<img src="${imgSrc}" alt="Icon" >
        	</div>
			<div class= "collection-title">
				<p>${collectionTitle}</p>
			</div>
		</div>`;
	});
	$('#collection-container').html(collectionsHtml);
};

pi.fetchProducts = function(id){
	/*alert('Fetch')*/
	return new Promise((resolve, reject) => {
		if (collectionDict[id]) {
			resolve();
		} else {
			const query = `
				{
				  collection(id: "${id}") {
				    title
				    image {
			          src
			          altText
			        }
			        metafields(identifiers: [{namespace: "custom", key: "brand"}, {namespace: "custom", key: "color_number_index"}]) {
			          key
			          namespace
			          value
			          id
			        }
				    products(first: 250) {
				      edges {
				        node {
				          id
				          title
				          description
				          images(first: 1) {
				            edges {
				              node {
				                src
				                altText
				              }
				            }
				          }
				          priceRange {
				            minVariantPrice {
				              amount
				              currencyCode
				            }
				          }
				        }
				      }
				    }
				  }
				}
				`;
		
		    fetch(shopifyLink, {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            'X-Shopify-Storefront-Access-Token': token
		            
		        },
		        body: JSON.stringify({ query })
		    })
		    .then(response => response.json())
		    .then(data => {
		//        console.log(data);
		        
		        collectionDict[id] = data;
				resolve();
				
				
		    })
		    .catch(error => {
				console.error('Error fetching products:', error);
				reject(error);
			})
		}
    
    });
//    console.log(brandsDict);
//	localStorage.setItem('brandsData', JSON.stringify(brandsDict));
//	let datajson = JSON.parse(localStorage.getItem('brandsData'));
//	console.log(datajson);
//    
 
    
};

pi.displayProducts = function(collectionID) {
	pi.getCollectionData(collectionID).then(collectionData => {
//		console.log(collectionData.data.collection.products.edges);
		let collection = collectionData.data.collection; 
		let colImageSrc = collection.image? collection.image.src : "images/DND.png";
		let colTitle = collection.title;
		productFramesHtml = `
		<div class="row ">
	        <div class="col-md-4 border-bold product-info" id="display-product">
	        	<div class = "product-info-img">
	        		<img src="${colImageSrc}" alt="Icon" >
	        	</div>
	        	<div class = "product-info-title">
	        		<h3>${colTitle}</h3>
	        	</div>
	        </div>
	        <div class="col-md-8 border-bold scrollable-window" id = "colorbased-products">
	            
	        </div>
	        </div>
	    </div>
	    <div class="row scrollable-window-x" id ="special-products">
	        
	    </div>
		`;
		$('#display-container').html(productFramesHtml);
		let nameIndex = collection.metafields? (collection.metafields[1].value - 1): 99;
		let coloredProductHtml = ``;
		let specialProductHtml=``;
//		console.log(collection.products.edges[2]);
		collection.products.edges.forEach(({node}, index) => {
			let titleArray = node.title.split(",");
//			console.log(titleArray, nameIndex)
			let imgSrc = node.images.edges[0]? node.images.edges[0].node.src: "images/DND.png";
			if(nameIndex < titleArray.length - 1) {
				
				coloredProductHtml += `
				<div class= "colored-product"  data-index ="${index}" data-collection="${collectionID}">
		        	<div class = "colored-product-img">
		        		<img src="${imgSrc}" alt="product image">
		        	</div>
		        	<div class = "colored-product-title">
		        		<h5>${titleArray[nameIndex]}</h5>
		        	</div>
	       		</div>
				`;
				
			} else {
				specialProductHtml +=`
					<div class= "row special-product" data-index ="${index}" data-collection="${collectionID}">
			        	<div class = "special-product-img">
			        		<img src="${imgSrc}" alt="product image">
			        	</div>
			        	<div class = "special-product-title">
			        		<h4>${node.title}</h4>
			        	</div>
		        	</div>
				`;
			}
		})
		$('#colorbased-products').html(coloredProductHtml);
		$('#special-products').html(specialProductHtml);
	})
	

};

pi.updateProInfo = function(collectionID, productIndex) {
	pi.getCollectionData(collectionID).then(collectionData =>{
		let node = collectionData.data.collection.products.edges[productIndex].node; 
		console.log (node);
		let imgSrc = node.images.edges[0]? node.images.edges[0].node.src: "images/DND.png";
		let productTitle = node.title;
		let productPrice = node.priceRange.minVariantPrice.amount;
		
		productHtml = `
	        
	    	<div class = "product-info-img">
	    		<img src="${imgSrc}" alt="Icon" >
	    	</div>
	    	<div class = "product-info-title">
	    		<h3>${productTitle}</h3>
	    	</div>
	    	<div class = "product-info-price">
	    		<h3>$ ${productPrice}</h3>
	    	</div>
	    	<div class="cart-form">
			    <div class="quantity-selector">
			        <button  class="quantity-btn minus" >-</button>
			        <input type="text" class="quantity-input" value="1" min="1" 
			        onkeypress="return event.charCode >= 48 && event.charCode <= 57" />
			        <button class="quantity-btn plus" >+</button>
			    </div>
			    <button type="button" class="add-to-cart" >Add to Cart</button>
			</div>
	    `
	    
	    $('#display-product').html(productHtml);
	});
}
pi.getCollectionData = function (collectionId){
	return new Promise((resolve, reject) => {
		data = collectionDict[collectionId];
		if (data){
			resolve(data);
		}else {
			reject(new Error('No Data Found.'));
		}
		
	});
};
pi.changeQuantity= function(num){
	let quantityInput = document.querySelector('.quantity-input');
	let currentQuantity = parseInt(quantityInput.value);
	let newQuantity = currentQuantity + num;
	newQuantity = newQuantity < 1 ? 1 : newQuantity;
	quantityInput.value = newQuantity;
}

}();


