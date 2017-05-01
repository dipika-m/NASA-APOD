import React from 'react';
import Swipeable from 'react-swipeable';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
const API_KEY = 'bDgiaxrXbyO19pNQKnEGvEUUCvvNkB7txObOkBIm';
const API_ENDPOINT = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const screenChangeEvents = [
  'fullscreenchange',
  'msfullscreenchange',
  'mozfullscreenchange',
  'webkitfullscreenchange'
];
const Title = styled.h1`
    text-align: center;
    color: white;
    padding: 1em 0em 0em 0em;
    font-family: monospace;
    font-size: 3em;
`;

const Wrapper = styled.div`
  padding: 0 4.5em;
  background-color: #1D4E69;
`;
const WrapperMain = styled.div`
    padding: 2em 0em;
    background-color: #1D4E69;
    margin-left: auto;
    margin-right: auto;`;

const Explanation = styled(Wrapper)`
    padding: 2em 2em;
    background-color: #34596d;
    border: 15px solid #1D4E69;
    box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    border-radius: 18px;
    width: 90%;
    color: white;
    font-family: serif;
    margin-left: auto;
    margin-right: auto;
`;
const Copyright = styled.div`
  padding: 0.3em;
  text-align: center;
  color: white;
`;
const Link = styled.a`
  color: tomato;
  margin: 0.5em 0;
  font-family: Helvetica, Arial, sans-serif;
  cursor:pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonFullScreen = styled.button`
    background-color: transparent;
    border: 0;
    cursor: pointer;
    outline: 0;
    z-index: 4;
    &::before {
    font-size: 2.7em;
    padding: 15px 20px;
    text-shadow: 0 1px 1px #1a1a1a;
    content: "";
    display: inline-block;
    font-family: Ionicons;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #fff;
    line-height: .7;
    text-shadow: 0 2px 2px #1a1a1a;
    transition: color .2s ease-out;
    }
`;
const WrapperC = styled(Wrapper)`
    background-color: #1D4E69;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
const APODIMAGE = styled.img`
    display: block;
    margin-left: auto;
    margin-right: auto;`;

const SectionM = styled.section`
margin: -2.2em;`;
export default class MediaGallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentIndex: props.startIndex,
      galleryWidth: 0,
      isFullscreen: false,
      imageWidth:900,
    };

    if (props.lazyLoad) {
      this._lazyLoaded = [];
    }

  }

  static propTypes = {
    items: React.PropTypes.array.isRequired,
    showNav: React.PropTypes.bool,
    lazyLoad: React.PropTypes.bool,
    showFullscreenButton: React.PropTypes.bool,
    useBrowserFullscreen: React.PropTypes.bool,
    defaultImage: React.PropTypes.string,
    startIndex: React.PropTypes.number,
    imageWidth: React.PropTypes.number,
    onSlide: React.PropTypes.func,
    onScreenChange: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onImageLoad: React.PropTypes.func,
    onImageError: React.PropTypes.func,
    renderLeftNav: React.PropTypes.func,
    renderRightNav: React.PropTypes.func,
    renderFullscreenButton: React.PropTypes.func,
    renderItem: React.PropTypes.func
  };

  static defaultProps = {
    items: [],
    showNav: true,
    autoPlay: false,
    lazyLoad: false,
    infinite: true,
    showIndex: false,
    showPlayButton: false,
    showFullscreenButton: true,
    disableArrowKeys: false,
    disableSwipe: false,
    useBrowserFullscreen: true,
    indexSeparator: ' / ',
    thumbnailPosition: 'bottom',
    startIndex: 0,
    slideDuration: 450,
    imageWidth:900,
    slideInterval: 3000,
    renderLeftNav: (onClick, disabled) => {
      return (
        <ButtonLeftNav
          type='button'
          disabled={disabled}
          onClick={onClick}
          aria-label='Previous Slide'
        />
      );
    },
    renderRightNav: (onClick, disabled) => {
      return (
        <ButtonRightNav
          type='button'
          disabled={disabled}
          onClick={onClick}
          aria-label='Next Slide'
        />
      );
    },
    renderFullscreenButton: (onClick, isFullscreen) => {
      return (
<ButtonFullScreen
          type='button'
          className={
            `icon-fullscreen`}
          onClick={onClick}
          aria-label='Open Fullscreen'>
        </ButtonFullScreen>
        
      );
    },
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.disableArrowKeys !== nextProps.disableArrowKeys) {
      if (nextProps.disableArrowKeys) {
        window.removeEventListener('keydown', this._handleKeyDown);
      } else {
        window.addEventListener('keydown', this._handleKeyDown);
      }
    }

    if (nextProps.lazyLoad &&
      (!this.props.lazyLoad || this.props.items !== nextProps.items)) {
      this._lazyLoaded = [];
    }

    if (this.state.currentIndex >= nextProps.items.length) {
      this.slideToIndex(0);
    }
    
  }

  componentDidUpdate(prevProps, prevState) {
    
console.log("componentDidUpdate" + this.props.imageWidth);
    if (prevState.currentIndex !== this.state.currentIndex) {
      if (this.props.onSlide) {
        this.props.onSlide(this.state.currentIndex);
      }

      this._updateThumbnailTranslate(prevState);
    }
    if (prevProps.slideDuration !== this.props.slideDuration) {
      this.slideToIndex = throttle(this._unthrottledSlideToIndex,
                                   this.props.slideDuration,
                                   {trailing: false});
    }
  }

  componentWillMount() {
    // Used to update the throttle if slideDuration changes
    this._unthrottledSlideToIndex = this.slideToIndex.bind(this);
    this.slideToIndex = throttle(this._unthrottledSlideToIndex,
                                 this.props.slideDuration,
                                {trailing: false});

    this._handleResize = this._handleResize.bind(this);
    this._debounceResize = debounce(this._handleResize, 500);
    this._handleScreenChange = this._handleScreenChange.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._thumbnailDelay = 300;
  }

  componentDidMount() {
    this._handleResize();

    if (this.props.autoPlay) {
      this.play();
    }
    if (!this.props.disableArrowKeys) {
      window.addEventListener('keydown', this._handleKeyDown);
    }
    window.addEventListener('resize', this._debounceResize);
    this._onScreenChangeEvent();
  }

  componentWillUnmount() {
    if (!this.props.disableArrowKeys) {
      window.removeEventListener('keydown', this._handleKeyDown);
    }

    if (this._debounceResize) {
      window.removeEventListener('resize', this._debounceResize);
    }

    this._offScreenChangeEvent();
  }

  setModalFullscreen(state) {
      this.setState({modalFullscreen: state});
      // manually call because browser does not support screenchange events
      if (this.props.onScreenChange) {
        this.props.onScreenChange(state);
      }
  }

  fullScreen() {
    const gallery = this._imageGallery;
    if (this.props.useBrowserFullscreen) {
      if (gallery.requestFullscreen) {
        gallery.requestFullscreen();
      } else if (gallery.msRequestFullscreen) {
        gallery.msRequestFullscreen();
      } else if (gallery.mozRequestFullScreen) {
        gallery.mozRequestFullScreen();
      } else if (gallery.webkitRequestFullscreen) {
        gallery.webkitRequestFullscreen();
      } else {
        // fallback to fullscreen modal for unsupported browsers
        this.setModalFullscreen(true);
      }
    } else {
      this.setModalFullscreen(true);
    }

    this.setState({isFullscreen: true});

  }

  exitFullScreen() {
    if (this.state.isFullscreen) {
      if (this.props.useBrowserFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else {
          // fallback to fullscreen modal for unsupported browsers
          this.setModalFullscreen(false);
        }
      } else {
        this.setModalFullscreen(false);
      }

      this.setState({isFullscreen: false});

    }
  }

  slideToIndex(index, event) {
    const {currentIndex} = this.state;

    if (event) {
      if (this._intervalId) {
        // user triggered event while ImageGallery is playing, reset interval
        this.pause(false);
        this.play(false);
      }
    }

    let slideCount = this.props.items.length - 1;
    let nextIndex = index;

    if (index < 0) {
      nextIndex = slideCount;
    } else if (index > slideCount) {
      nextIndex = 0;
    }

    this.setState({
      previousIndex: currentIndex,
      currentIndex: nextIndex,
      offsetPercentage: 0,
      style: {
        transition: `all ${this.props.slideDuration}ms ease-out`
      }
    });

  }

  getCurrentIndex() {
    return this.state.currentIndex;
  }

  _handleScreenChange() {
    /*
      handles screen change events that the browser triggers e.g. esc key
    */
    const fullScreenElement = document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;

    if (this.props.onScreenChange) {
      this.props.onScreenChange(fullScreenElement);
    }

    this.setState({isFullscreen: !!fullScreenElement});
  }

  _onScreenChangeEvent() {
    screenChangeEvents.map(eventName => {
      document.addEventListener(eventName, this._handleScreenChange);
    });
  }

  _offScreenChangeEvent() {
    screenChangeEvents.map(eventName => {
      document.removeEventListener(eventName, this._handleScreenChange);
    });
  }

  _toggleFullScreen() {
    if (this.state.isFullscreen) {
      this.exitFullScreen();
    } else {
      this.fullScreen();
    }
  }

  _togglePlay() {
    if (this._intervalId) {
      this.pause();
    } else {
      this.play();
    }
  }

  _handleResize() {
    // delay initial resize to get the accurate this._imageGallery height/width
    this._resizeTimer = window.setTimeout(() => {
      if (this._imageGallery) {
        this.setState({
          galleryWidth: this._imageGallery.offsetWidth
        });
      }

      // adjust thumbnail container when thumbnail width or height is adjusted
      this._setThumbsTranslate(
        -this._getThumbsTranslate(
          this.state.currentIndex > 0 ? 1 : 0) * this.state.currentIndex);

      if (this._imageGallerySlideWrapper) {
        this.setState({
          gallerySlideWrapperHeight: this._imageGallerySlideWrapper.offsetHeight
        });
      }

      if (this._thumbnailsWrapper) {
        if (this._isThumbnailHorizontal()) {
          this.setState({thumbnailsWrapperHeight: this._thumbnailsWrapper.offsetHeight});
        } else {
          this.setState({thumbnailsWrapperWidth: this._thumbnailsWrapper.offsetWidth});
        }
      }
    }, 500);
  }

  _isThumbnailHorizontal() {
    const { thumbnailPosition } = this.props;
    return thumbnailPosition === 'left' || thumbnailPosition === 'right';
  }

  _handleKeyDown(event) {
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;
    const key = parseInt(event.keyCode || event.which || 0);

    switch(key) {
      case LEFT_ARROW:
        if (this._canSlideLeft() && !this._intervalId) {
          this._slideLeft();
        }
        break;
      case RIGHT_ARROW:
        if (this._canSlideRight() && !this._intervalId) {
          this._slideRight();
        }
        break;
    }
  }

  _handleMouseOverThumbnails(index) {
    if (this.props.slideOnThumbnailHover) {
      this.setState({hovering: true});
      if (this._thumbnailTimer) {
        window.clearTimeout(this._thumbnailTimer);
        this._thumbnailTimer = null;
      }
      this._thumbnailTimer = window.setTimeout(() => {
        this.slideToIndex(index);
      }, this._thumbnailDelay);
    }
  }


  _handleImageError(event) {
    if (this.props.defaultImage &&
        event.target.src.indexOf(this.props.defaultImage) === -1) {
      event.target.src = this.props.defaultImage;
    }
  }

  _handleOnSwiped(ev, x, y, isFlick) {
    this.setState({isFlick: isFlick});
  }

  _shouldSlideOnSwipe() {
    const shouldSlide = Math.abs(this.state.offsetPercentage) > 30 ||
      this.state.isFlick;

    if (shouldSlide) {
      // reset isFlick state after so data is not persisted
      this.setState({isFlick: false});
    }
    return shouldSlide;
  }

  _handleOnSwipedTo(index) {
    let slideTo = this.state.currentIndex;

    if (this._shouldSlideOnSwipe()) {
      slideTo += index;
    }

    if (index < 0) {
      if (!this._canSlideLeft()) {
        slideTo = this.state.currentIndex;
      }
    } else {
      if (!this._canSlideRight()) {
        slideTo = this.state.currentIndex;
      }
    }

    this._unthrottledSlideToIndex(slideTo);
  }

  _handleSwiping(index, _, delta) {
    const { swipingTransitionDuration } = this.props;
    const { galleryWidth } = this.state;

    let offsetPercentage = index * (delta / galleryWidth * 100);
    if (Math.abs(offsetPercentage) >= 100) {
      offsetPercentage = index * 100;
    }

    const swipingTransition = {
      transition: `transform ${swipingTransitionDuration}ms ease-out`
    };

    this.setState({
      offsetPercentage: offsetPercentage,
      style: swipingTransition
    });
  }

  _canNavigate() {
    return this.props.items.length >= 2;
  }

  _canSlideLeft() {
    return this.props.infinite || this.state.currentIndex > 0;
  }

  _canSlideRight() {
    return this.props.infinite ||
      this.state.currentIndex < this.props.items.length - 1;
  }

  _updateThumbnailTranslate(prevState) {
    if (this.state.currentIndex === 0) {
      this._setThumbsTranslate(0);
    } else {
      let indexDifference = Math.abs(
        prevState.currentIndex - this.state.currentIndex);
      let scroll = this._getThumbsTranslate(indexDifference);
      if (scroll > 0) {
        if (prevState.currentIndex < this.state.currentIndex) {
          this._setThumbsTranslate(
            this.state.thumbsTranslate - scroll);
        } else if (prevState.currentIndex > this.state.currentIndex) {
          this._setThumbsTranslate(
            this.state.thumbsTranslate + scroll);
        }
      }
    }
  }

  _setThumbsTranslate(thumbsTranslate) {
    this.setState({thumbsTranslate});
  }

  _getThumbsTranslate(indexDifference) {
    if (this.props.disableThumbnailScroll) {
      return 0;
    }

    const {thumbnailsWrapperWidth, thumbnailsWrapperHeight} = this.state;
    let totalScroll;

    if (this._thumbnails) {

      // total scroll required to see the last thumbnail
      if (this._isThumbnailHorizontal()) {
        if (this._thumbnails.scrollHeight <= thumbnailsWrapperHeight) {
          return 0;
        }
        totalScroll = this._thumbnails.scrollHeight - thumbnailsWrapperHeight;
      } else {
        if (this._thumbnails.scrollWidth <= thumbnailsWrapperWidth) {
          return 0;
        }
        totalScroll = this._thumbnails.scrollWidth - thumbnailsWrapperWidth;
      }

      let totalThumbnails = this._thumbnails.children.length;
      // scroll-x required per index change
      let perIndexScroll = totalScroll / (totalThumbnails - 1);

      return indexDifference * perIndexScroll;

    }
  }

  _getAlignmentClassName(index) {
    // LEFT, and RIGHT alignments are necessary for lazyLoad
    let {currentIndex} = this.state;
    let alignment = '';
    const LEFT = 'left';
    const CENTER = 'center';
    const RIGHT = 'right';

    switch (index) {
      case (currentIndex - 1):
        alignment = ` ${LEFT}`;
        break;
      case (currentIndex):
        alignment = ` ${CENTER}`;
        break;
      case (currentIndex + 1):
        alignment = ` ${RIGHT}`;
        break;
    }

    if (this.props.items.length >= 3 && this.props.infinite) {
      if (index === 0 && currentIndex === this.props.items.length - 1) {
        // set first slide as right slide if were sliding right from last slide
        alignment = ` ${RIGHT}`;
      } else if (index === this.props.items.length - 1 && currentIndex === 0) {
        // set last slide as left slide if were sliding left from first slide
        alignment = ` ${LEFT}`;
      }
    }

    return alignment;
  }

  _getTranslateXForTwoSlide(index) {
    // For taking care of infinite swipe when there are only two slides
    const {currentIndex, offsetPercentage, previousIndex} = this.state;
    const baseTranslateX = -100 * currentIndex;
    let translateX = baseTranslateX + (index * 100) + offsetPercentage;

    // keep track of user swiping direction
    if (offsetPercentage > 0) {
      this.direction = 'left';
    } else if (offsetPercentage < 0) {
      this.direction = 'right';
    }

    // when swiping make sure the slides are on the correct side
    if (currentIndex === 0 && index === 1 && offsetPercentage > 0) {
      translateX = -100 + offsetPercentage;
    } else if (currentIndex === 1 && index === 0 && offsetPercentage < 0) {
      translateX = 100 + offsetPercentage;
    }

    if (currentIndex !== previousIndex) {
      // when swiped move the slide to the correct side
      if (previousIndex === 0 && index === 0 &&
          offsetPercentage === 0 && this.direction === 'left') {
        translateX = 100;
      } else if (previousIndex === 1 && index === 1 &&
          offsetPercentage === 0 && this.direction === 'right') {
        translateX = -100;
      }
    } else {
      // keep the slide on the correct slide even when not a swipe
      if (currentIndex === 0 && index === 1 &&
          offsetPercentage === 0 && this.direction === 'left') {
        translateX = -100;
      } else if (currentIndex === 1 && index === 0 &&
          offsetPercentage === 0 && this.direction === 'right') {
        translateX = 100;
      }
    }

    return translateX;
  }

  _getThumbnailBarHeight() {
    if (this._isThumbnailHorizontal()) {
      return {
        height: this.state.gallerySlideWrapperHeight
      };
    }
    return {};
  }

  _getSlideStyle(index) {
    const {currentIndex, offsetPercentage} = this.state;
    const {infinite, items} = this.props;
    const baseTranslateX = -100 * currentIndex;
    const totalSlides = items.length - 1;

    // calculates where the other slides belong based on currentIndex
    let translateX = baseTranslateX + (index * 100) + offsetPercentage;

    // adjust zIndex so that only the current slide and the slide were going
    // to is at the top layer, this prevents transitions from flying in the
    // background when swiping before the first slide or beyond the last slide
    let zIndex = 1;
    if (index === currentIndex) {
      zIndex = 3;
    } else if (index === this.state.previousIndex) {
      zIndex = 2;
    } else if (index === 0 || index === totalSlides) {
      zIndex = 0;
    }

    if (infinite && items.length > 2) {
      if (currentIndex === 0 && index === totalSlides) {
        // make the last slide the slide before the first
        translateX = -100 + offsetPercentage;
      } else if (currentIndex === totalSlides && index === 0) {
        // make the first slide the slide after the last
        translateX = 100 + offsetPercentage;
      }
    }

    // Special case when there are only 2 items with infinite on
    if (infinite && items.length === 2) {
      translateX = this._getTranslateXForTwoSlide(index);
    }

    const translate3d = `translate3d(${translateX}%, 0, 0)`;

    return {
      WebkitTransform: translate3d,
      MozTransform: translate3d,
      msTransform: translate3d,
      OTransform: translate3d,
      transform: translate3d,
      zIndex: zIndex
    };
  }

  _getThumbnailStyle() {
    let translate3d;

    if (this._isThumbnailHorizontal()) {
      translate3d = `translate3d(0, ${this.state.thumbsTranslate}px, 0)`;
    } else {
      translate3d = `translate3d(${this.state.thumbsTranslate}px, 0, 0)`;
    }
    return {
      WebkitTransform: translate3d,
      MozTransform: translate3d,
      msTransform: translate3d,
      OTransform: translate3d,
      transform: translate3d
    };
  }

  _slideLeft(event) {
    this.slideToIndex(this.state.currentIndex - 1, event);
  }

  _slideRight(event) {
    this.slideToIndex(this.state.currentIndex + 1, event);
  }

  _renderItem(item) {
    const onImageError = this.props.onImageError || this._handleImageError;
 if(item.media_type == 'image'){
    return (
     <Wrapper>
         <Title>{item.title}</Title>
          <WrapperMain>
        <APODIMAGE
            src={this.props.imageWidth > 999 ? item.hdurl : item.url}
            width={this.props.imageWidth}
            onLoad={this.props.onImageLoad}
            onError={onImageError.bind(this)}
            align= 'middle'
        />
         </WrapperMain>
         <WrapperC>
        <Copyright>{item.copyright ? item.copyright : '@Copyright: NASA'  }</Copyright>
        
         {
          this.props.showFullscreenButton &&
            this.props.renderFullscreenButton(this._toggleFullScreen.bind(this), this.state.isFullscreen)
        }
        </WrapperC>
        {
          item.explanation &&
            <Explanation>
              {item.explanation}
            </Explanation>
        }
      </Wrapper>
    );
 }else{
   return(
            <Wrapper>
         <Title>{item.title}</Title>
                
                <iframe
                  width= {this.state.imageWidth}
                  height='315'
                  src={item.url}
                  frameBorder='0'
                  allowFullScreen
                >
                </iframe>
            </Wrapper>
    );
  }};


  render() {
    const {
      currentIndex,
      isFullscreen,
      modalFullscreen,
      isPlaying
    } = this.state;

    const thumbnailStyle = this._getThumbnailStyle();
    const thumbnailPosition = this.props.thumbnailPosition;

    const slideLeft = this._slideLeft.bind(this);
    const slideRight = this._slideRight.bind(this);

    let slides = [];
    let thumbnails = [];
    let bullets = [];
    this.props.items.map((item, index) => {
      const alignment = this._getAlignmentClassName(index);
      const originalClass = item.originalClass ?
        ` ${item.originalClass}` : '';
      const thumbnailClass = item.thumbnailClass ?
        ` ${item.thumbnailClass}` : '';

      const renderItem = item.renderItem ||
        this.props.renderItem || this._renderItem.bind(this);

      const showItem = !this.props.lazyLoad || alignment || this._lazyLoaded[index];
      if (showItem && this.props.lazyLoad) {
        this._lazyLoaded[index] = true;
      }

      const slide = (
        <div
          key={index}
          className={'image-gallery-slide' + alignment + originalClass}
          style={Object.assign(this._getSlideStyle(index), this.state.style)}
          onClick={this.props.onClick}
        >
          {showItem ? renderItem(item) : <div style={{ height: '100%' }}></div>}
        </div>
      );

      slides.push(slide);

    });

    const slideWrapper = (
      <Wrapper
        ref={i => this._imageGallerySlideWrapper = i}
        className={`image-gallery-slide-wrapper ${thumbnailPosition}`}
      >

        {this.props.renderCustomControls && this.props.renderCustomControls()}

       

        {
          this.props.showPlayButton &&
            this.props.renderPlayPauseButton(this._togglePlay.bind(this), isPlaying)
        }

        {
          this._canNavigate() ?
            [
              this.props.showNav &&
                <span key='navigation'>
                  {this.props.renderLeftNav(slideLeft, !this._canSlideLeft())}
                  {this.props.renderRightNav(slideRight, !this._canSlideRight())}
                </span>,

                this.props.disableSwipe ?
                  <div className='image-gallery-slides' key='slides'>
                    {slides}
                  </div>
                :
                  <Swipeable
                    className='image-gallery-swipe'
                    key='swipeable'
                    delta={1}
                    onSwipingLeft={this._handleSwiping.bind(this, -1)}
                    onSwipingRight={this._handleSwiping.bind(this, 1)}
                    onSwiped={this._handleOnSwiped.bind(this)}
                    onSwipedLeft={this._handleOnSwipedTo.bind(this, 1)}
                    onSwipedRight={this._handleOnSwipedTo.bind(this, -1)}
                    onSwipedDown={this._handleOnSwipedTo.bind(this, 0)}
                    onSwipedUp={this._handleOnSwipedTo.bind(this, 0)}
                  >
                    <div className='image-gallery-slides'>
                      {slides}
                    </div>
                </Swipeable>
            ]
          :
            <div className='image-gallery-slides'>
              {slides}
            </div>
        }
        {
          this.props.showIndex &&
            <div className='image-gallery-index'>
              <span className='image-gallery-index-current'>
                {this.state.currentIndex + 1}
              </span>
              <span className='image-gallery-index-separator'>
                {this.props.indexSeparator}
              </span>
              <span className='image-gallery-index-total'>
                {this.props.items.length}
              </span>
            </div>
        }
      </Wrapper>
    );

    return (
      <section
        ref={i => this._imageGallery = i}
        className={
          `image-gallery${modalFullscreen ? ' fullscreen-modal' : ''}`}
        aria-live='polite'
      >

        <div
          className={`image-gallery-content${isFullscreen ? ' fullscreen' : ''}`}
        >

          {
            (thumbnailPosition === 'bottom' || thumbnailPosition === 'right') &&
              slideWrapper
          }


        </div>

      </section>
    );
  }

}
