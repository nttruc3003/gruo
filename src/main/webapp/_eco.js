/* Copyright (c) 2024 Aviado Inc. All rights reserved. */

$(document).ready(function() {
	moeco.clouch();
});


var moeco = new function() {

var pi = this;

var vendor = '';

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
                <div class = "col-md-12 scrollable-window" id="display-container" style="height: 90vh">
                
                    
                    
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
		pi.fetchProducts($(target).data('name')).then(()=> {
			pi.displayProductsOfCollections($(target).data('name'));
		}).catch(error => {
			console.error('Error in fetching products:', error);
		});
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
	$('#display-container').html(collectionsHtml);
};

pi.fetchProducts = function(id){
	/*alert('Fetch')*/
	return new Promise((resolve, reject) => {
	const query = `
		{
		  collection(id: "${id}") {
		    title
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
        let productsArray = data.data.collection.products.edges;
        collectionDict[id] = productsArray;
		resolve();
		
		
    })
    .catch(error => {
		console.error('Error fetching products:', error);
		reject(error);
		})
    
    });
//    console.log(brandsDict);
//	localStorage.setItem('brandsData', JSON.stringify(brandsDict));
//	let datajson = JSON.parse(localStorage.getItem('brandsData'));
//	console.log(datajson);
//    
 
    
};

pi.displayProductsOfCollections= function(collectionID) {
	console.log(collectionID);
	console.log(collectionDict);
	let products = collectionDict[collectionID];
	console.log(products);

};   

}();


