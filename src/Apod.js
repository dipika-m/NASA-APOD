import 'whatwg-fetch';
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components';
import MediaGallery from './component/MediaGallery.js';

const Throwaway = styled.p`
  text-align: center;
  font-size: 32px;
  color: #2A9BD6;
`;
const API_KEY = 'bDgiaxrXbyO19pNQKnEGvEUUCvvNkB7txObOkBIm';
const API_ENDPOINT= `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
const API_ENDPOINT_WITHDATE = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=`;
const Settings = styled.div`
    margin: 1em 5em;
    padding: 0em 0.5em;
    box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    border-radius: 3px;
    width: 25%;
`;
const Heading = styled.div`
    font-size: 10em;
    color: #2A9BD6;
    font-family: impact,monospace;
    margin: -40px 0px;
    padding: 0;`;
const SubHeading = styled.div`
    font-size: 1.7em;
    color: black;
    font-family: impact,monospace;
    padding: 0;`;
    const UlList = styled.ul`
         list-style-type: none; `;
export default class Apod extends Component {
  
  constructor() {
    super();
    this.state = {
      showFullscreenButton: true,
      showGalleryFullscreenButton: true,
      showPlayButton: false,
      imageWidth: 900,
      showVideo: {},
      items: new Array(),
    };
 
    var that = this;
    fetch(API_ENDPOINT)
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function (data) {
        that._handleImageChange("items", data);
      });
      //we can add the code for previous images as well
    // for (let i = 1; i < 7; i++) {
    //   var priorDate = new Date();
    //   priorDate.setDate(priorDate.getDate() - i)
    //   let url = API_ENDPOINT_WITHDATE + convertDate(priorDate);
    //   fetch(url)
    //     .then(function (response) {
    //       if (response.status >= 400) {
    //         throw new Error("Bad response from server");
    //       }
    //       return response.json();
    //     })
    //     .then(function (data) {
    //       that._handleImageChange("items", data);
    //     });
    // }
  }

 

  
  _onImageClick(event) {
    console.debug('clicked on image', event.target, 'at index', this._mediaGallery.getCurrentIndex());
  }

  _onImageLoad(event) {
    console.debug('loaded image', event.target.src);
  }

  _onSlide(index) {
    this._resetVideo();
    console.debug('slid to index', index);
  }

  _onPause(index) {
    console.debug('paused on index', index);
  }

  _onScreenChange(fullScreenElement) {
    console.debug('isFullScreen?', !!fullScreenElement);
  }

  _onPlay(index) {
    console.debug('playing from index', index);
  }
  _handleImageChange(state, data) {
   let arr =  this.state.items;
   arr.push(data);
   this.setState({[state]: arr});
  }
  _handleInputChange(state, event) {
    this.setState({[state]: event.target.value});
  }

  _handleCheckboxChange(state, event) {
    this.setState({[state]: event.target.checked});
  }

 
  _resetVideo() {
    this.setState({showVideo: {}});

    if (this.state.showPlayButton) {
      this.setState({showGalleryPlayButton: true});
    }

    if (this.state.showFullscreenButton) {
      this.setState({showGalleryFullscreenButton: true});
    }
  }

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({showGalleryPlayButton: false});
      }

      if (this.state.showFullscreenButton) {
        this.setState({showGalleryFullscreenButton: false});
      }
    }
  }

  renderLoadingView() {
    return <Throwaway>Loading....</Throwaway>;
  }
   


  render() {
    console.info(this.state.items);
    if (!this.state.items) {
        return this.renderLoadingView();
      }else{
    return (
     
      <section className='app'>
        <Heading>APOD</Heading>
        <SubHeading>Astronomy Picture Of the Day </SubHeading>
        <MediaGallery
          ref={i => this._mediaGallery = i}
          items={this.state.items}
          lazyLoad={false}
          onClick={this._onImageClick.bind(this)}
          onImageLoad={this._onImageLoad}
          onSlide={this._onSlide.bind(this)}
          onPause={this._onPause.bind(this)}
          onScreenChange={this._onScreenChange.bind(this)}
          onPlay={this._onPlay.bind(this)}
          showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
          imageWidth={parseInt(this.state.imageWidth)}
        />

        <Settings >

          <div className='app-sandbox-content'>
            <h2 className='app-header'>Settings</h2>

            <UlList>
              <li>
                <div className='app-interval-input-group'>
                  <span className='app-interval-label'>Image Size</span>
                  <input
                    type='text'
                    onChange={this._handleInputChange.bind(this, 'imageWidth')}
                    value={this.state.imageWidth}/>
                </div>
              </li>
            </UlList>

            <UlList>
              
              <li>
                <input
                  id='show_fullscreen'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'showFullscreenButton')}
                  checked={this.state.showFullscreenButton}/>
                  <label htmlFor='show_fullscreen'>show fullscreen button</label>
              </li>
              
            </UlList>
          </div>

        </Settings>
      </section>
    );
  }}
}
function convertDate(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}
