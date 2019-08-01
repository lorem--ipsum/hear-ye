import React from 'react';

import './side-by-side.scss';

export function SideBySide(props: React.Props<{}>) {
  return <div className="hy-side-by-side">{props.children}</div>;
}
