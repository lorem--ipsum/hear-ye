// Auto-generated file

import * as React from 'react';
import * as ReactDOM from 'react-dom';

%topLevelImports%

if (!%options%.noNiceCss) require('./index.scss');

function importAll(r: any) {
  r.keys().forEach(r);
}

importAll((require as any).context('../', true, /\.demo\.tsx$/));

import { Gallery } from 'hear-ye';

Gallery.projectInfo = %project-info%;
Gallery.options = %options%;

ReactDOM.render(React.createElement(Gallery), document.getElementsByClassName('hy-container')[0]);
