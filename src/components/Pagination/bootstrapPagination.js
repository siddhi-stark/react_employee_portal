import React from 'react';
import { Pagination } from 'react-bootstrap';

export default function BootstapPaginationComponent(props) {
    const {
        containerClass,
        activePage,
        itemsPerPage,
        totalItems,
        onPageChange,
    } = { ...props };

    const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total number of pages

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber !== activePage) {
            onPageChange(pageNumber);
        }
    };

    // Function to render pagination items
    const renderPaginationItems = () => {
        const items = [];

        if (totalPages <= 5) {
            // Show all page numbers if there are less than or equal to 5 pages
            for (let page = 1; page <= totalPages; page += 1) {
                items.push(
                    <Pagination.Item
                        key={page}
                        active={page === activePage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                );
            }
        } else {
            // Show first page, last page, and ellipsis for large number of pages
            items.push(
                <Pagination.Item
                    key={1}
                    active={activePage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    {1}
                </Pagination.Item>
            );

            if (activePage > 3) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }

            const startPage = Math.max(2, activePage - 1);
            const endPage = Math.min(totalPages - 1, activePage + 1);

            for (let page = startPage; page <= endPage; page += 1) {
                items.push(
                    <Pagination.Item
                        key={page}
                        active={page === activePage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                );
            }

            if (activePage < totalPages - 2) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }

            items.push(
                <Pagination.Item
                    key={totalPages}
                    active={activePage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <>
            <nav className={containerClass}>
                {
                 totalItems > 10 &&   
                <Pagination className='d-flex justify-content-center'>
                    <Pagination.Prev
                        onClick={() => handlePageChange(activePage - 1)}
                        disabled={activePage === 1}
                    />
                    {renderPaginationItems()}
                    <Pagination.Next
                        onClick={() => handlePageChange(activePage + 1)}
                        disabled={activePage === totalPages}
                    />
                </Pagination>
                }
            </nav>
        </>
    );
}
