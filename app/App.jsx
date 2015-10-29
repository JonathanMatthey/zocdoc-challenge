'use strict';

var React = require('react');
var FullTable = require('./full_table.jsx');
var classNames = require('classnames');

module.exports = React.createClass({
    displayName: 'ZocDocMovies',
    authToken: '3b502b3f-b1ff-4128-bd99-626e74836d9c',

    getInitialState() {
        return {
            selectedTab: 'search',
            allMovies: [],
            selectedMovies: []
        }
    },

    componentWillMount: function() {
        this.fetchAllMovies();
    },

    onTabSelect(tabName) {
        this.setState({
            selectedTab: tabName
        })
    },

    onMovieSelect(movie){
        console.log(movie);
        var movies = this.state.selectedMovies;
        var i, found = false;
        for (i = 0; i < movies.length; i++) {
            if (movies[i] === movie) {
                found = true;
            }
        }
        if(!found){
            movies.push(movie)
        }
        this.setState({
            selectedMovies: movies
        });
        console.log('movies: ',this.state.selectedMovies)
    },

    fetchAllMovies () {
        var self = this;
        fetch('https://interview.zocdoc.com/api/1/FEE/AllMovies?authToken=' + this.authToken , {
            method: 'GET'
        })
        .then(response => {
            if (response.status !== 200) {
              return Promise.reject(new Error('Failed to update banner'))
            }
            return response.json().then(body => {
                self.setState({
                    allMovies: body,
                });
                console.log('App - fetch allmovies: ',this.state.allMovies.length)
            })
        })
    },

    deselectMovie(movieId){
        var selectedMovies = this.state.selectedMovies;
        for (var i=0; i < selectedMovies.length; i++) {
            if (selectedMovies[i].Id === movieId) {
                selectedMovies.splice(i,1)
                break;
            }
        }
        this.setState({
            'selectedMovies': selectedMovies
        });
        console.log('removed!?')
    },

    render() {
        console.log('app render, allmovies:',this.state.allMovies.length)
        var self = this;
        return (
            <div className="container">
                <header>
                    <h1><i className="logo"></i> Movies</h1>
                </header>
                <article>
                    <div>
                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" className={classNames({ 'active': this.state.selectedTab === 'search' })} onClick={this.onTabSelect.bind(this, "search")}><a aria-controls="home" role="tab" data-toggle="tab">Search</a></li>
                            <li role="presentation" className={classNames({ 'active': this.state.selectedTab === 'compare' })} onClick={this.onTabSelect.bind(this, "compare")}><a aria-controls="profile" role="tab" data-toggle="tab">Compare ({this.state.selectedMovies.length})</a></li>
                        </ul>
                        <div className="tab-content">
                            <div role="tabpanel" className={classNames('tab-pane',{ 'active': this.state.selectedTab === 'search' })}>
                                <FullTable movies={this.state.allMovies} handleSelectMovie={this.onMovieSelect}/>
                            </div>
                            <div role="tabpanel" className={classNames('compare-movies','tab-pane',{ 'active': this.state.selectedTab === 'compare' })}>
                                {this.state.selectedMovies.map(movie => (
                                    <div className="col-xs-6" key={movie.Id}>
                                        <div className="movie-card">
                                            <a onClick={this.deselectMovie.bind(self,movie.Id)} className="btn btn-deselect-movie pull-right">x</a>
                                            <h2>
                                              {movie.Name}
                                            </h2>
                                            <div className="row">
                                                <dl className="col-xs-4">
                                                  <dt>Director</dt>
                                                  <dd>{movie.Director}</dd>
                                                </dl>
                                                <dl className="col-xs-4">
                                                  <dt>Duration</dt>
                                                  <dd>{movie.Duration}</dd>
                                                </dl>
                                                <dl className="col-xs-4">
                                                  <dt>Genres</dt>
                                                  <dd>{movie.Genres.join(', ')}</dd>
                                                </dl>
                                            </div>
                                            <div className="row">
                                                <dl className="col-xs-12">
                                                  <dt>Description</dt>
                                                  <dd>{movie.Description}</dd>
                                                </dl>
                                            </div>
                                            <div className="row">
                                                <dl className="col-xs-12">
                                                  <dt>Actors</dt>
                                                  <dd>{movie.Actors.join(', ')}</dd>
                                                </dl>
                                            </div>
                                            <a className='btn btn-xs btn-primary btn-book btn-block' href="http://zocdoc.com">
                                                Book
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                {(() => {
                                        if (this.state.selectedMovies.length === 0) {
                                            return (
                                                <div className="error ">You haven't selected any movies to compare.  Go back to Search and click Compare</div>
                                            )
                                        }
                                })()}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    },
});
