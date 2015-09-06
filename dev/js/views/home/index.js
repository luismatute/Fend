define(['owl'], function () {
	$(".home-owl").owlCarousel({
		items: 1,
		singleItem: true,
		autoHeight: true,
		nav: true,
		navText: false,
		mouseDrag: false,
		touchDrag: false,
		autoPlay: 5000,
		stopOnHover: true,
		lazyLoad: true
	});

	$('.rst-owl').owlCarousel({
		items: 1,
		singleItem: true,
		autoPlay: 5000,
		loop: true,
		autoHeight: true,
		nav: false,
		dots: false
	});
});