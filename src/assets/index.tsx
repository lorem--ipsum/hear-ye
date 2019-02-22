import * as React from 'react';
import * as ReactDOM from 'react-dom';

%topLevelImports%

import "../**/*.demo.tsx";

import { Gallery } from 'hear-ye';

ReactDOM.render(React.createElement(Gallery), document.getElementsByClassName('hy-container')[0]);
