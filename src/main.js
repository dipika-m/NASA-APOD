import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import Apod from './Apod.js';
import { injectGlobal } from 'styled-components';

injectGlobal`
	@font-face {
  font-family: "Ionicons";
  src: url("https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.eot?v=2.0.0");
  src: url("https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.eot?v=2.0.0#iefix") format("embedded-opentype"), url("https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.ttf?v=2.0.0") format("truetype"), url("https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.woff?v=2.0.0") format("woff"), url("https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.svg?v=2.0.0#Ionicons") format("svg");
  font-weight: normal;
  font-style: normal; }
`

render(<Apod />, document.querySelector('#app'));