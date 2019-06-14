import * as React from 'react';
import * as classNames from 'classNames';

import { basic_folder } from 'react-icons-kit/linea/basic_folder';

import { Icon } from '../icon/icon';

interface ExampleFolderProps extends React.Props<any> {
  level: number;
  label: string;
  className: string;
  open?: boolean;
}

interface ExampleFolderState {
  expanded?: boolean;
}

export class ExampleFolder extends React.Component<ExampleFolderProps, ExampleFolderState> {
  static getDerivedStateFromProps(props: ExampleFolderProps, state: ExampleFolderState) {
    if (props.open && state.expanded == null) {
      return {
        expanded: props.open
      };
    }

    return null;
  }

  constructor(props: ExampleFolderProps) {
    super(props);

    this.state = {};
  }

  render() {
    const { className, level, label, children } = this.props;
    const { expanded } = this.state;

    return <div className={classNames(className, {open: expanded})}>
      <div className="label" onClick={() => this.setState({expanded: !expanded})}  style={{paddingLeft: level * 10 + 20}}>
        <Icon size={15} icon={basic_folder}/>
        <div className="label-content">{label}</div>
      </div>

      {expanded &&
        <div className="children">
          {children}
        </div>
      }

    </div>
  }
}
