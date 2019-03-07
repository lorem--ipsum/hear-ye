import * as React from 'react';
import * as ReactDOM from 'react-dom';

%topLevelImports%

function importAll(r) {
  r.keys().forEach(r);
}

importAll((require as any).context('../', true, /\.demo\.tsx$/));

import { Gallery } from 'hear-ye';

ReactDOM.render(React.createElement(Gallery), document.getElementsByClassName('hy-container')[0]);
