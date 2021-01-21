import axios from "axios";

const baseUrl = "https://pixabay.com/api/?q=";
const page = "&page=";
const key = "&key=19539896-abe26f00558e3a292a16c6b93";
const requestParams = "&image_type=photo&orientation=horizontal&per_page=12";

export const axiosRequest = (searchQuery, pageNumber = 1) => {
  return axios.get(
    baseUrl + searchQuery + page + pageNumber + key + requestParams
  );
};
