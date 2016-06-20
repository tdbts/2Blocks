/* global document, google */
  
import getRandomPanoramaLocation from './getRandomPanoramaLocation';
import showChooseLocationMap from './showChooseLocationMap';  
// import { createStore } from 'redux'; 

/*=================================
=            twoBlocks()          =
=================================*/

const twoBlocks = function twoBlocks(gameComponents) {

	/*----------  Configure Redux Store  ----------*/
	
	// const configureStore = function configureStore(reducer, initialState) {

	// 	const store = createStore(
	// 		reducer, 
	// 		initialState, 
	// 		window.devToolsExtension ? window.devToolsExtension() : undefined
	// 	);

	// 	return store; 
	// }; 

	const { canvas, locationData, nycBoundaryLatLngs, nycLatLngMaxMin, nycPolygon, panorama, spinner } = gameComponents; 

	getRandomPanoramaLocation(panorama, nycPolygon, nycLatLngMaxMin)

		.then(randomLatLng => panorama.setPosition(randomLatLng)) 

		.then(() => {

			panorama.setVisible(true); 

			spinner.start(); 

			spinner.once('revolution', () => {
			
				spinner.stop(); 

				const gps = new google.maps.LatLng(locationData.center.lat, locationData.center.lng); 

				const mapOptions = {
					center: gps
				}; 

				const chooseLocationMap = showChooseLocationMap(canvas, nycBoundaryLatLngs, mapOptions);

				// Outside the polygon boundaries, in the Atlantic Ocean 
				const markerLat = 40.480993; 
				const markerLng = -73.72798; 

				const markerOptions = {
					animation: google.maps.Animation.BOUNCE, 
					draggable: true, 
					map: chooseLocationMap, 
					position: new google.maps.LatLng(markerLat, markerLng)
				}; 

				const chooseLocationMarker = new google.maps.Marker(markerOptions); 

				google.maps.event.addListener(chooseLocationMarker, 'dragstart', () => chooseLocationMarker.setAnimation(null)); 

				google.maps.event.addListener(chooseLocationMap, 'click', e => {

					const { latLng } = e; 

					chooseLocationMarker.setPosition(latLng); 
					chooseLocationMarker.setAnimation(null); 

				});

				const calculateDistanceBetweenLatLngs = function calculateDistanceBetweenLatLngs(first, second) {
				
					return google.maps.geometry.spherical.computeDistanceBetween(first, second); 	
				
				};

				const convertMetersToMiles = function convertMetersToMiles(meters) {
				
					const MILES_PER_METER = 0.000621371; 

					return meters * MILES_PER_METER; 
				
				}; 

				google.maps.event.addListener(chooseLocationMarker, 'dragend', () => {
				
					const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), chooseLocationMarker.getPosition());

					const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3);  

					window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles); 

				}); 

				google.maps.event.addListener(chooseLocationMap, 'click', () => {

					const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), chooseLocationMarker.getPosition()); 

					const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3); 

					window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles);  

				}); 

			}); 

		})		

		.catch((...args) => `Caught error with args ${args}`); 

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
