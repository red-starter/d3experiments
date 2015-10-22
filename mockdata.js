// product_name, brand_name, tags,number of people who own it, category, status ->owned/finished/wish/expired
// size --> travel/full , photo , personal_notes -->280 characters


var datum = function(obj){
	// properties shared with other products, passed in
	this.category=obj.category;
	this.brand_name=obj.brand_name;
	this.status=obj.status;
	this.size=obj.size;
	// unique properties generated locally
	this.product_name=faker.commerce.productName();
	this.price=faker.commerce.price();
	this.ingredients=faker.lorem.words().concat(faker.lorem.words());
	this.count=Math.floor(Math.random())*25;
	this.personal_notes=faker.lorem.sentences();
	this.photo=faker.image.cats();	
}

//create n products
var fakeData = function(n){
	var status = ['owned','finished','wish','expired']
	var size = ['travel','full']
	var brands = []
	var categories = []
	var numOfBrands = Math.floor(Math.sqrt(n)) || 3
	var numOfCategories = Math.floor(Math.sqrt(n)) || 5
	// have 10 brands
	for (var i = 0; i < numOfBrands; i++) {
		brands.push(faker.company.companyName())
	};
	for (var i = 0; i < numOfCategories; i++) {
		categories.push(faker.commerce.product())
	};

	var storage = [];
	//generate fake objects
	for (var i = 0; i < n; i++) {
		brandIndex = Math.floor(Math.random()*brands.length);
		statusIndex = Math.floor(Math.random()*status.length)
		sizeIndex = Math.floor(Math.random()*size.length)
		categoryIndex = Math.floor(Math.random()*categories.length)
		obj = {
			status:status[statusIndex],
			size:size[sizeIndex],
			brand_name:brands[brandIndex],
			category:categories[categoryIndex]
		}
		storage.push(new datum(obj))
	};
	return JSON.stringify(storage);
}