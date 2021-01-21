import React, { Component, createRef } from "react";
import Searchbar from "../searchBar/SearchBar";
import { axiosRequest } from "../../services/Services";
import ImageGallery from "../imageGallery/ImageGallery";
import Button from "../button/Button";
import Loader from "../loader/Loader";
import Modal from "../modal/Modal";

export default class App extends Component {
  LisrRef = createRef();

  state = {
    images: [],
    searchQuery: "",
    pageNumber: 1,
    isLoading: false,
    isModalOpen: false,
    imageOpenedInModal: null,
  };
  //func to do reuest to PIXABAY and set state
  imagesRequest = (
    searchQuery = this.state.searchQuery,
    pageNumber = this.state.pageNumber
  ) => {
    this.setState({ isLoading: true });
    axiosRequest(searchQuery, pageNumber)
      .then(({ data }) =>
        this.setState((prevState) => {
          return {
            images: [...prevState.images, ...data.hits],
            pageNumber: prevState.pageNumber + 1,
          };
        })
      )
      .catch((error) => console.log(error))
      .finally(
        this.setState({ isLoading: false })
        //   window.scrollTo({
        //     top: document.documentElement.scrollHeight,
        //     behavior: "smooth",
        //   })
      );
  };

  // clear "this.state.images" & "this.state.pageNumber" if user input new request
  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.setState({ images: [], pageNumber: 1 });
    }
  }

  //set searchQuery into state
  handleSearchbarInputChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  //do reuest to PIXABAY and set state after submiting the form
  handleSearchbarFormSubmit = (e) => {
    e.preventDefault();
    this.imagesRequest();
  };

  //do reuest for the next page of images and set state after clicking the Load More Button
  handleLoadMoreButtonClick = () => {
    this.imagesRequest();
  };

  handleClickOnImage = (e) => {
    this.setState({
      isModalOpen: true,
      imageOpenedInModal: e.target.dataset.url,
    });
  };

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  render() {
    const {
      images,
      searchQuery,
      isLoading,
      isModalOpen,
      imageOpenedInModal,
    } = this.state;
    return (
      <>
        <Searchbar
          value={searchQuery}
          onHandleSubmit={this.handleSearchbarFormSubmit}
          onSearchQueryChange={this.handleSearchbarInputChange}
        />
        {isLoading && <Loader />}
        {images.length > 0 && (
          <ImageGallery
            ref={this.LisrRef}
            onHandleClickOnImage={this.handleClickOnImage}
            images={images}
          />
        )}
        {images.length > 0 && (
          <Button onLoadMoreButtonClick={this.handleLoadMoreButtonClick} />
        )}
        {isModalOpen && (
          <Modal
            largeURL={imageOpenedInModal}
            onCloseModal={this.handleCloseModal}
          />
        )}
      </>
    );
  }
}
