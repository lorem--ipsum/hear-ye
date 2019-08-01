require('./api-doc.scss');

import React from 'react';
import classNames from 'classnames';
import { InterfaceApi, Property, PropertyUsage } from 'muskad';

export interface ApiDocProps extends React.Props<any> {
  interfaceName: string;
}

export interface ApiDocState {}

export class ApiDoc extends React.Component<ApiDocProps, ApiDocState> {
  static interfaces: InterfaceApi[];
  private mounted = false;

  constructor(props: ApiDocProps, context: any) {
    super(props, context);
    this.state = {};
  }

  fetchDoc() {
    if (ApiDoc.interfaces) {
      return;
    }

    fetch('muskad-doc.json')
      .then(r => r.json())
      .then(json => {
        ApiDoc.interfaces = json.map(InterfaceApi.fromJS);

        if (!this.mounted) return;
        this.forceUpdate();
      });
  }

  componentDidMount() {
    this.mounted = true;

    this.fetchDoc();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  renderPropertyUsage = (usage: PropertyUsage, index: number) => {
    return (
      <div
        key={index}
        className={classNames('example', {
          block: usage.value.indexOf('\n') > 1,
        })}
      >
        <div className="value">{usage.value}</div>
        <div className="label">{usage.label}</div>
      </div>
    );
  };

  renderProperty = (property: Property, index: number) => {
    const examples = property.description.getExamples();

    return (
      <div className="property" key={index}>
        <div className="label">
          <span className="name">{property.label}</span>
          <span className="type">{property.type}</span>
          {property.optional ? <span className="optional">optional</span> : null}
        </div>
        <div className="description">
          {property.description.content ? property.description.content : <i>no description</i>}
        </div>
        {examples.length > 0 ? (
          <div className="examples">
            <h3>Example{examples.length > 1 ? 's' : ''}</h3>
            {examples.map(this.renderPropertyUsage)}
          </div>
        ) : null}
      </div>
    );
  };

  render() {
    const { interfaceName } = this.props;

    if (!ApiDoc.interfaces) return null;

    const doc = ApiDoc.interfaces.find(d => d.name === interfaceName);

    if (!doc) return null;

    return (
      <div className="hy-api-doc hy-section">
        <div className="title">API</div>
        <div className="content">
          <div className="label">{doc.name}</div>
          <div className="properties">{doc.properties.map(this.renderProperty)}</div>
        </div>
      </div>
    );
  }
}
