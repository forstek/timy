// @flow
import React, { Component } from 'react';
import { desktopCapturer } from 'electron';
import styles from './Home.css';

type Props = {};
const duration = 60 * 1000;

export default class Home extends Component<Props> {
  props: Props;

  fullscreenScreenshot(callback, imageFormat) {
    this.callback = callback;
    this.imageFormat = imageFormat || 'image/jpeg';

    this.handleStream = stream => {
      // Create hidden video tag
      const video = document.createElement('video');
      video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

      // Event connected to stream
      video.onloadedmetadata = function onloadedmetadata() {
        // Set video ORIGINAL height (screenshot)
        video.style.height = `$${this.videoHeight}px`; // videoHeight
        video.style.width = `$${this.videoWidth}px`; // videoWidth

        video.play();

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        const ctx = canvas.getContext('2d');
        // Draw video on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (callback) {
          // Save screenshot to base64
          callback(canvas.toDataURL(this.imageFormat));
        } else {
          console.log('Need callback!');
        }

        // Remove hidden video tag
        video.remove();
        try {
          // Destroy connect to stream
          stream.getTracks()[0].stop();
        } catch (e) {
          console.log(e);
        }
      };

      video.srcObject = stream;
      document.body.appendChild(video);
    };

    this.handleError = e => {
      console.log(e);
    };

    desktopCapturer.getSources(
      { types: ['window', 'screen'] },
      (_ignore, sources) => {
        // for (const source of sources) {
        sources.forEach(async source => {
          if (
            source.name === 'Entire screen' ||
            source.name === 'Screen 1' ||
            source.name === 'Screen 2'
          ) {
            // Filter: main screen
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    minWidth: 1280,
                    maxWidth: 4000,
                    minHeight: 720,
                    maxHeight: 4000
                  }
                }
              });

              this.handleStream(stream);
            } catch (e) {
              this.handleError(e);
            }
          }
        });
      }
    );
  }

  handleClickCaptureScreen = () => {
    setTimeout(() => {
      this.fullscreenScreenshot(this.cb, 'image/png');
      this.handleClickCaptureScreen();
    }, duration * Math.random());
  };

  cb = base64 => {
    document.getElementById('img-preview').setAttribute('src', base64);
  };

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <div className={styles.headline}>
          <h2>Timy</h2>
          <p>Time tracker</p>
          <p>for</p>
          <p>remote working</p>
          <button onClick={this.handleClickCaptureScreen}>
            {' '}
            {/* eslint-disable-line */}
            capture screen
          </button>
          <br />
          <img
            id="img-preview"
            style={{ height: '150px', marginTop: '20px' }}
            alt="screen capture"
          />
        </div>
      </div>
    );
  }
}
