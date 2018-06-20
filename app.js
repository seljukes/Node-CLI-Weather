const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: false,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;
if(argv.address === undefined){
  axios.get("http://icanhazip.com/").then((response) => {
    var ip = response.data.replace("\n","");

    return axios.get(`http://api.ipstack.com/${ip}?access_key=4ba9dd11ee1d6b157945e58cb8bfcd68`);
  }).then((response) =>{
    var weatherUrl = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${response.data.latitude},${response.data.latitude}?units=auto`;
    console.log(response.data.city + " " + response.data.zip);
    return axios.get(weatherUrl);
  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
  }).catch((e) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message);
    }
  });
}else{
  var encodedAddress = encodeURIComponent(argv.address);

  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

  axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}?units=auto`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
  }).catch((e) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message);
    }
  });
}