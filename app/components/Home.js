// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  state = {
    posts : []
  }

  render() {
    const { posts } = this.state

    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
        <button onClick={this.handleClickShow}>Show</button>
        {
          posts &&
          posts.map(post => (
            <div>
              <span>{post.title}</span>
            </div>
          ))
        }
      </div>
    );
  }

  handleClickShow = () => {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'iqbal',
        body: 'novramadani',
        userId: 1
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
      .then(post => {
        this.setState({ posts: [post] })
      })
  }
}
