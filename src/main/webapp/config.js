/* Copyright (c) 2024 Aviado Inc. All rights reserved. */

const config = {
	hierarchy : {
		groups:		["GEL X/ Extention Gel", "3 IN 1 (GEL, POLISH, POWDER)","DIPPING LIQUID",
			 		"BASE-TOP", "NAIL TOOLS", "SALON EQUIPMENTS", "SPECIAL"],
		brands: 	["DND", "DC", "iGel", "Gelish", "Cre8tion", "CND","Gelixir"],
		productTypes:["SOAK OFF GEL", "ACRYLIC POWDER & LIQUID", "ART TIPS", "BUILDER GELS", "DIPPING POWDERS",
				  	 "NAIL ART", "NAIL BRUSH"]
	},
	ticket : {
		  id: '0001', 
		  stamp: '20240305', 
		  status: 'open', 
		  client: {
		    name: "John Doe",
		    phone: "1234567890", 
		    address: {
		      street: "123 Main St",
		      city: "Anytown",
		      state: "CA", 
		      zip: "12345" 
		    }
		  },
		  items: [
//		    {
//		      id: "collection001", //collectionID
//		      label: "Collection Number 001", //collectiontitle
//		      price0: 0.00, //calculated by variants
//		      count: 0,
//		      price: 0.00, //calculated by variants
//		
//		      size: 0.00,
//		      pricelabel: "",
//		      subitems: [
////		        {
////		          label: "",
////		          price: 0.00
////		        }
//		      ],
//		      extras: [
////		        {
////		          label: "",
////		          price: 0.50
////		        }
//		      ],
//		
//		      variants: [ //store product-info
////		        {
////		          id: "product001", //productID
////		          label: "Product Number 001", //productTitle
////		          count: 0, //quantity of products
////		          price0: 0.00, // price of one unit
////		          value: "Medium", //index of product in Collection for efficiency
////		          price: 0.00 //Total Price
////		        }
//		      ],
//		      extras: [
////		        {
////		          id: "extra01",
////		          label: "Whipped Cream",
////		          price: 0.50
////		        }
//		      ]
//		    }
		  ],
		  note: "",
		  discount1: 0.00,
		  discount2: 0.00,
		  tax1: 0.30,
		  tax2: 0.20,
		  tip: 1.00, 
		  convenience: 0.50,
		  shipping: 0.00, 
		  log: {} 
		}
		
};
