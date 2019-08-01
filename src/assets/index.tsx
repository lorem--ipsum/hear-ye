// Auto-generated file

import React from 'react';
import ReactDOM from 'react-dom';

%topLevelImports%

if (!%options%.noNiceCss) require('./index.scss');

function importAll(r: any) {
  r.keys().forEach(r);
}

importAll((require as any).context('../', true, /\.demo\.tsx$/));

import { Gallery } from 'hear-ye';

ReactDOM.render(
  <Gallery
    projectInfo={%project-info%}
    strict={%options%.strict}
    standalone={%options%.standalone}
    noNiceCss={%options%.noNiceCss}
    hearYeVersion="%version%"
  />,
  document.getElementsByClassName('hy-container')[0]
);
