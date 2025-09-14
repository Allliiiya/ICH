export const config = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'your_google_maps_api_key_here',

  apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080',

  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',

  googleMaps: {
    defaultCenter: {
      lat: 40.7128,
      lng: -74.0060
    },
    defaultZoom: 8,
    mapOptions: { 
      disableDefaultUI: false, 
      zoomControl: true, 
      mapTypeControl: true, 
      scaleControl: true, 
      streetViewControl: true, 
      rotateControl: true, 
      fullscreenControl: true
    }
  }
};

export const validateConfig = () => {
  const requiredVars = ['VITE_GOOGLE_MAPS_API_KEY'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please create a .env file in the project root with the required variables.');
  }
  
  return missing.length === 0;
};
