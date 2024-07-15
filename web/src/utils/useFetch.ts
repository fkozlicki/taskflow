import {createFetch} from "@vueuse/core";

export const useFetch = createFetch({
    baseUrl: 'http://localhost:8080/api',
    fetchOptions: {
        credentials: 'include'
    },
})