import React from 'react';
import PaginationComponent from 'react-js-pagination';

const defaults = {
  activePage: 1,
  itemsPerPage: 10,
  totalItems: 10,
};

export default function Pagination(props) {
  const {
    containerClass,
    activePage,
    itemsPerPage,
    totalItems,
    onPageChange,
  } = { ...defaults, ...props };
  return (
    <>
      <nav className={containerClass}>
        <PaginationComponent
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalItems}
          onChange={(changedPage) => {
            if (onPageChange) onPageChange(changedPage);
          }}
          itemClass="page-item"
          linkClass="page-link"
          hideFirstLastPages
          hideDisabled
        />
      </nav>
    </>
  );
}
