// @flow
import React, { Component } from 'react';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <div className={styles.headline}>
          <h2>Timy</h2>
          <p>Time tracker</p>
          <p>for</p>
          <p>remote working</p>
        </div>
      </div>
    );
  }
}
