import React from 'react';

import {
  Typography,
} from '@material-ui/core';

export const PreviewWeb3Transaction = ({ component }) => {

  return (
    <div>
      <Typography>{ component.nework } { component.address } { component.signature }</Typography>
    </div>
  );
}
