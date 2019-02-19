import * as React from 'react';
import * as ReactDOM from 'react-dom';

import "../src/**/*.demo.tsx";

import { Gallery } from 'hear-ye';

ReactDOM.render(React.createElement(Gallery), document.getElementsByClassName('app-container')[0]);
