<template>
    <div class="flex flex-col flex-1 items-center">
      <div 
        class="text-white p-4 bg-weather-secondary w-full text-center" 
        v-if="route.query.preview"
      >
        <p>you are currently prevewing this city, click the "+" icon to start tracking this city</p>
      </div>
      <div class="flex flex-col items-center text-white py-12">
        <h1 class="text-4xl">
          {{ route.params.city }}
        </h1>
        <p class="text-sm mb-12">
          {{ new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
          }) 
          }}
          {{ new Date(weatherData.currentTime).toLocaleTimeString('en-us', {
            timeStyle: 'short'
          }) 
          }}
        </p>
        <p class="text-xl mb-8">
          {{ Math.round(weatherData.current.temp) }} &deg;
        </p>
          <p>
            Feels {{ Math.round(weatherData.current.feels_like) }} &deg;
          </p>
          <p class="capitalize">
            {{ weatherData.current.weather[0].description }}
          </p>
          <img 
            :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`" 
            class="w-[150px] h-auto"
            alt=""
          >
      </div>
      <hr class="border-white border-opacity-10 border w-full" />
      <div class="max-w-screen-md w-full py-12">
        <div class="mx-8 text-white">
          <h2 class="mb-4">
            Hourly Weather
          </h2>
          <div class="flex gap-10 overflow-x-scroll">
            <div 
              v-for="hourData in weatherData.hourly" 
              :key="hourData.dt"
              class="flex items-center px-4 flex-col"
            >
              <p class="whitespace-nowrap text-md">
                {{ 
                  new Date(
                    hourData.currentTime
                  ).toLocaleTimeString('en-us', {
                    hour: 'numeric'
                  })
                }}
              </p>
              <img 
                :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" 
                class="w-auto h-[50px] object-cover"
                alt="weather icon"
              >
              <p class="text-xl">
                {{ Math.round(hourData.temp) }} &deg;
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-white border-opacity-10 border w-full" />
      <div class="max-w-screen-md w-full p-12">
        <div class="mx-8 text-white">
          <h2 class="mb-4">7 Days Forecast</h2>
          <div
            v-for="day in weatherData.daily"
            :key="day.dt"
            class="flex items-center"
          >
            <p class="flex-1">
              {{ 
                new Date(
                  day.dt * 1000
                ).toLocaleDateString('en-us', {
                  weekday: 'long'
                })
              }}
            </p>
            <img 
              :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" 
              class="w-[50px] h-[50px] object-cover"
              alt="weather icon"
            >
            <div class="flex gap-2 flex-1 justify-end">
              <p>H: {{ Math.round(day.temp.max) }}</p>
              <p>L: {{ Math.round(day.temp.min) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div 
        class="flex capitalize items-center gap-2 py-12 text-white cursor-pointer hover:text-red-500"
        @click="removeCity"
        title="Danger"
      >
        <i class="fa-solid fa-trash"></i>
        <p>remove city</p>
      </div>
    </div>  
</template>
  
<script setup>
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
const getWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=imperial`
    );
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = response.data.current.dt * 1000 + localOffset;
    response.data.currentTime = 
      utc + 1000 * response.data.timezone_offset;

    response.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = 
        utc + 1000 * response.data.timezone_offset;
    });

    return response.data;
  }catch (error) {
    console.log(error);
  }
};

const weatherData = await getWeatherData();

const delay = (second) => new Promise((resolve) => setTimeout(resolve, second));
await delay(2000);
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem('savedCities'));
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem('savedCities', JSON.stringify(updatedCities));
  router.push({
    name: 'home'
  });
};
</script>