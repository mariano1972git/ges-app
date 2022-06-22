import range from 'lodash.range';
import React, { useCallback } from 'react';
import {
  Typeahead,
  Highlighter,
  Menu,
  MenuItem,
} from 'react-bootstrap-typeahead';
import { render } from 'react-dom';
import List from 'react-tiny-virtual-list';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import './styles.css';

const options = range(0, 1000).map(o => `Option ${o.toString()}`);

const WindowingExample = () => {
  const renderMenu = useCallback((results, menuProps, props) => {
    const itemHeight = 32;

    return (
      <Menu {...menuProps}>
        <List
          scrollToIndex={props.activeIndex || 0}
          scrollToAlignment="auto"
          height={results.length < 5 ? results.length * itemHeight : 300}
          itemCount={results.length}
          itemSize={itemHeight}
          renderItem={({ index, style }) => {
            const item = results[index];
            return (
              <MenuItem key={item} option={item} position={index} style={style}>
                <Highlighter search={props.text}>{item}</Highlighter>
              </MenuItem>
            );
          }}
        />
      </Menu>
    );
  });

  return (
    <Typeahead
      id="pagination-example"
      maxResults={false}
      options={options}
      paginate={false}
      placeholder="Pick a number..."
      renderMenu={renderMenu}
    />
  );
};

render(<WindowingExample />, document.getElementById('root'));
