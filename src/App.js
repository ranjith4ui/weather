import React, {useState, useEffect} from 'react';
import './App.css';
import axios  from "axios";
import Search from './components/Search';
import {weatherForecast} from './Api'
import Weather from './components/Weather';
import Loader from './components/Loader';
import Geocode from "react-geocode";

function App() {
 

Geocode.setApiKey("AIzaSyDPV99Wcs3FGPixaYNVx2ZNEs_TzyapkVs");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType("ROOFTOP");
const [value, setValue] = useState('');
const [state, setState] = useState({
  current: {
  },
  weekInfo: [],
  loading: false,
  error: false,
})
  useEffect(() => {
    // Update the document title using the browser API
    getLocation();
  },[]);
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
         
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          (response) => {
            let city, state, country;
            for (let i = 0; i < response.results[0].address_components.length; i++) {
              for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                switch (response.results[0].address_components[i].types[j]) {
                  case "locality":
                    city = response.results[0].address_components[i].long_name;
                    break;
                  case "administrative_area_level_1":
                    state = response.results[0].address_components[i].long_name;
                    break;
                  case "country":
                    country = response.results[0].address_components[i].long_name;
                    break;
                }
              }
            }
            console.log(city, state, country);
            setValue(city);
            setTimeout(
              
              () => handleSearchCity(city), 
              1000
            );
          }
        );
       
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

 
  
  const handleInputChange = e => {
   
    setValue(e.target.value);
  };

  const handleSearch = () => {
    handleSearchCity(value)
  }

  const handleSearchCity = (value) => {
    // e.preventDefault();
    setState({
      ...state,
      loading: true
    })
    console.log(value)
    axios.get(weatherForecast(value))
    .then(response => {
      const data = response.data
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'Nocvember',
        'December',
      ]

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const currentDate = new Date()
      const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
        months[currentDate.getMonth()]
      }`;

      const sunset = new Date(data.list[0].sunset * 1000).toLocaleTimeString().slice(0, 4)
      const sunrise = new Date(data.list[0].sunrise * 1000).toLocaleTimeString().slice(0, 4)

      const current = {
        city: data.city.name,
        country: data.city.country,
        date,
        population: data.city.population,
        desc: data.list[0].weather[0].description,
        main: data.list[0].weather[0].main,
        icon: data.list[0].weather[0].icon,
        temp: data.list[0].temp.day,
        hTemp: data.list[0].temp.max,
        lTemp: data.list[0].temp.min,
        sunrise,
        sunset,
        clouds: data.list[0].clouds,
        humidity: data.list[0].humidity,
        wind: data.list[0].speed,
        pressure: data.list[0].pressure,
      }

      const weekData = data.list
      const weekInfo = weekData.map((data, index) => {
        return{
          key:index,
          main: data.weather[0].main,
          day: new Date(data.dt * 1000).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).slice(0,3),
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
          hTemp: data.temp.max,
          lTemp: data.temp.min,
        }})

      setState({
        ...state,
        current,
        weekInfo,
        loading: false,
        error: false,
      })
      
      })
      .catch(error => {
        console.log(error);

        setState({
          ...state,
          loading: false,
          error: true,
          current: {},
          weekInfo: [],
        })
      })
    }

  return (
    <>
      <Search 
        value={value}
        data = {state}
        showResult={(state.weatherInfo || state.error) && true}
        change={handleInputChange}
        submit={handleSearch} 
      />
      {
        state.loading === true ? 
        <Loader /> :
      <div>  
        {state.current.country !== undefined ? 
        <div className="weather">
          <Weather today={state.current} weekly={state.weekInfo} />
        </div> : 
        state.error ? 
        <p className="error__loc">Sorry! we donot have any information on specified location.</p> :
        <div>

        </div>
        }
      </div>
      }
    </>
  )
}

export default App;
