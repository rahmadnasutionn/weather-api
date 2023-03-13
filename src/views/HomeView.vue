<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input 
        type="text"
        placeholder="Search for a city"
        class="py-2 px-1 bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71] w-full"
        v-model="searchQuery"
        @input="getSearchResults"
      >
      <ul 
        class="absolute bg-weather-secondary w-full text-white shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResult"
      >
      <p v-if="searchError">
        Something went wrong, please try again
      </p>
      <p v-if="!searchError && mapboxSearchResult.length === 0">
        No result match your query
      </p>
      <template v-else>
        <li 
          v-for="searchResult in mapboxSearchResult" 
          :key="searchResult.id"
          class="cursor-pointer py-2"
          @click="previewCity(searchResult)"
        >
          {{ searchResult.place_name }}
        </li>
      </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityList from '../components/CityList.vue';
import CityCardSkeleton from '../components/CityCardSkeleton.vue';

const router = useRouter();

const previewCity = (searchResult) => {
  const [city, state] = searchResult.place_name.split(',');
  router.push({
    name: 'cityView',
    params: { state: state.replaceAll(" ", ""), city: city },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true
    }
  })
}

const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResult = ref(null);
const searchError = ref(null);

const mapboxAPIKey =
  "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q";

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
      );
        mapboxSearchResult.value = result.data.features;
      } catch (error) {
        searchError.value = true;
      }
      
      return;
    }
    mapboxSearchResult.value = null;
  }, 3000);
};
</script>