// import React from 'react';
// import PaginationComponent from 'react-js-pagination';

// const defaults = {
//   activePage: 1,
//   itemsPerPage: 10,
//   totalItems: 10,
// };

// export default function Pagination(props) {
//   const {
//     containerClass,
//     activePage,
//     itemsPerPage,
//     totalItems,
//     onPageChange,
//   } = { ...defaults, ...props };
//   return (
//     <>
//     {console.log('pagination',activePage,
//         itemsPerPage,
//         totalItems)}
//       <nav className={containerClass}>
//         <PaginationComponent
//           activePage={activePage}
//           itemsCountPerPage={itemsPerPage}
//           totalItemsCount={totalItems}
//           onChange={(changedPage) => {
//             if (onPageChange) onPageChange(changedPage);
//           }}
//           itemClass="page-item"
//           linkClass="page-link"
//           hideFirstLastPages
//           hideDisabled
//         />
//       </nav>
//     </>
//   );
// }

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

UNSAFE_componentWillReceiveProps(props) { // eslint-disable-line
  
this.setState({ activePage: props.currentPage });
}

handlePageChange = async (pageNumber) => {
const { getData } = this.props;
const { activePage } = this.state;
if (activePage !== pageNumber) {
await this.setState({ activePage: pageNumber });
if (getData)
getData(pageNumber);
}
}

render() {
  
  
// const { totalCount, limit, activePage } = this.state;
const { totalCount, limit, currentPage } = this.props;

return (
<div>
<PaginationComponent activePage={currentPage} itemsCountPerPage={limit} totalItemsCount={totalCount} pageRangeDisplayed={5} onChange={this.handlePageChange} hideFirstLastPages hideDisabled={true} activeClass />
</div>
);
}
}