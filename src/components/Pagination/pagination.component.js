import React, { Component } from 'react';
import PaginationComponent from 'react-js-pagination';
import './style.css';
// require("bootstrap/less/bootstrap.less");

export default class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    // eslint-disable-line

    this.setState({ activePage: props.current_page });
  }

  handlePageChange = async (pageNumber) => {
    const { onPageChange } = this.props;
    const { activePage } = this.state;
    if (activePage !== pageNumber) {
      await this.setState({ activePage: pageNumber });
      if (onPageChange) onPageChange(pageNumber);
    }
  };

  render() {
    // const { totalItems, itemsPerPage, activePage } = this.state;
    const { totalItems, itemsPerPage, current_page } = this.props; //eslint-disable-line

    return (
      <div>
        <PaginationComponent
          activePage={current_page} //eslint-disable-line
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalItems}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
          hideFirstLastPages
          hideDisabled={true}
          // activeClass
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    );
  }
}
