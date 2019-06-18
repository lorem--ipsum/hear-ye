# Hear-ye

Hear-ye is an opinionated component workbench for React. It helps developing components in isolation and picking the right component for the right need.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install hear-ye.

```bash
npm install hear-ye
```

## Requirements
Your project needs to:
1. be built with webpack
1. be written in TypeScript
1. follow a specific file structure (see File structure paragraph)

## Usage
Assuming your component library is called `awesome-components`:

### Example demo file
```typescript
// src/button/button.tsx
import * as React from 'react';

// styling is optional
import './button.scss';

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMMButtonElement>) => void;
}

export function Button(props: ButtonProps) {
  return <button {...props}/>;
}
```

```typescript
// src/button/button.demo.tsx
import { Button } from 'awesome-components';
import { Gallery, Sink } from 'hear-ye';
import * as React from 'react';

function ButtonDemo() {
  return <Sink>
    <Button onClick={e => console.log(e)}/>
  </Sink>;
}

Gallery.add({
  path: ['Button', 'Basic demo'],
  component: <ButtonDemo/>
});

```

```bash
hear-ye
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
