import styled from 'styled-components';

export const Container = styled.div`
    padding: 20px;
    background-color: #f8f9fa;
`;

export const TableStyles = styled.div`
    table {
        width: 100%;
        border-spacing: 0;
        border: 1px solid black;

        thead {
            background-color: #007bff;
            color: white;

            th {
                padding: 10px;
                border-bottom: 1px solid black;
            }
        }

        tbody {
            tr {
                &:nth-child(even) {
                    background-color: #f2f2f2;
                }

                &:hover {
                    background-color: #e9ecef;
                }

                td {
                    padding: 10px;
                    border-bottom: 1px solid black;
                    text-align: center;
                }
            }
        }
    }
`;

export const PaginationStyles = styled.div`
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;

        button {
            margin: 0 5px;
            padding: 5px 10px;
            border: 1px solid #007bff;
            background-color: #007bff;
            color: white;
            cursor: pointer;

            &:disabled {
                background-color: #c0c0c0;
                cursor: not-allowed;
            }
        }

        input {
            margin: 0 10px;
            padding: 5px;
            width: 50px;
            text-align: center;
        }

        select {
            margin-left: 10px;
            padding: 5px;
        }

        .active {
            background-color: #0056b3;
            border-color: #0056b3;
        }
    }
`;
