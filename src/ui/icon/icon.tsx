import React from 'react';
import { Icon as RIcon, IconProp } from 'react-icons-kit';

require('./icon.scss');

export class Icon extends React.Component<IconProp> {
  render() {
    const classes = [this.props.className, 'hy-icon'].filter(Boolean).join(' ');
    return <RIcon {...this.props} className={classes} />;
  }
}
