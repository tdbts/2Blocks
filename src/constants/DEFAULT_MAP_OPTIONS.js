export default {
	center: null,
	disableDoubleClickZoom: false,  
	draggable: false, 
	keyboardShortcuts: false, 
	mapTypeControl: false, 
	scrollwheel: false, 
	streetViewControl: false, 
	zoom: null,  // Cannot use DEFAULT_MAP_ZOOM from 'constants' because WebPack v1.x cannot handle circular dependencies
	zoomControl: false
}; 
