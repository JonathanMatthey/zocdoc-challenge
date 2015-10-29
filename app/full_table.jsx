'use strict';

var React = require('react');
var Form = require('plexus-form');
var validate = require('plexus-validate');
var Paginator = require('react-pagify');
var titleCase = require('title-case');
var findIndex = require('lodash/array/findIndex');

var Table = require('../src/table');
var Search = require('../src/search');
var sortColumn = require('../src/sort_column');
var cells = require('../src/cells');

module.exports = React.createClass({
    displayName: 'Movies',

    getInitialState() {
        var data = [{}];
        return {
            editedCell: null,
            data: data,
            formatters: {},
            search: {
                column: '',
                query: ''
            },
            compareMode:false,
            header: {
                onClick: (column) => {
                    // reset edits
                    this.setState({
                        editedCell: null
                    });
                    sortColumn(
                        this.state.columns,
                        column,
                        this.setState.bind(this)
                    );
                },
            },
            sortingColumn: null,
            columns: [
                {
                    property: 'Rank',
                    header: 'Rank'
                },
                {
                    property: 'Name',
                    header: 'Name'
                },
                {
                    property: 'Director',
                    header: 'Director'
                },
                {
                    property: 'Duration',
                    header: 'Duration'
                },
                {
                    property: 'Genres',
                    header: 'Genres'
                },
                {
                    cell: function(value, celldata, rowIndex) {
                        var idx = findIndex(this.state.data, {
                            id: celldata[rowIndex].id,
                        });

                        return {
                            value: (
                                <div className="actions">
                                    <span data-action="compare" className='btn btn-xs btn-default btn-compare'>
                                        Compare
                                    </span>
                                    <a className='btn btn-xs btn-primary btn-book' href="http://zocdoc.com">
                                        Book
                                    </a>
                                </div>
                            )
                        };
                    }.bind(this),
                },
            ],
            pagination: {
                page: 0,
                perPage: 10
            }
        };
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({
        data: nextProps.movies
      });
    },

    onSearch(search) {
        this.setState({
            editedCell: null, // reset edits
            search: search
        });
    },

    onClickCompare(){
        this.setState({
            compareMode: true
        });
    },

    onCompareSelect(movie){
        this.props.handleSelectMovie(movie);
    },

    render() {
        var header = this.state.header;
        var columns = this.state.columns;
        var pagination = this.state.pagination;
        var data = this.state.data;
        var self = this;

        if (this.state.search.query) {
            data = Search.search(
                data,
                columns,
                this.state.search.column,
                this.state.search.query
            );
        }

        data = sortColumn.sort(data, this.state.sortingColumn);

        var paginated = Paginator.paginate(data, pagination);

        return (
            <div>
                <div className='row search-controls'>
                        <div className='pull-right'>
                            <label>Search</label>
                            <Search columns={columns} data={this.state.data} onChange={this.onSearch} />
                        </div>
                </div>
                <div className='row'>
                    <div className="col-xs-12">
                        <Table
                            className='table'
                            header={header}
                            columns={columns}
                            data={paginated.data}
                            row={(d, rowIndex) => {
                                return {
                                    // className: rowIndex % 2 ? 'odd-row' : 'even-row',
                                    onClick: (e) => {
                                        if(e.target.dataset.hasOwnProperty('action') && e.target.dataset.action === 'compare'){
                                            self.onCompareSelect(d)
                                        }
                                    }
                                };
                            }}
                        >
                        </Table>
                    </div>
                </div>
                <div className='row controls'>
                    <div className="col-xs-12">
                        <nav>
                            <Paginator
                                className='pagination pull-right'
                                ellipsesClassName='pagify-ellipsis'
                                inactiveClassName='inactive'
                                page={paginated.page}
                                pages={paginated.amount}
                                beginPages={10}
                                endPages={10}
                                onSelect={this.onSelect} />
                            <div className='pull-left per-page-container'>
                                Per page <input type='text' defaultValue={pagination.perPage} onChange={this.onPerPage}></input>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        );
    },

    onSelect(page) {
        var pagination = this.state.pagination || {};

        pagination.page = page;

        this.setState({
            pagination: pagination
        });
    },

    onPerPage(e) {
        var pagination = this.state.pagination || {};

        pagination.perPage = parseInt(e.target.value, 10);

        this.setState({
            pagination: pagination
        });
    },
});

function find(arr, key, value) {
    return arr.reduce((a, b) => a[key] === value ? a : b[key] === value && b);
}
