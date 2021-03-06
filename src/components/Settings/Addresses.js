import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from '@material-ui/icons/Delete';

import { useAppTemplate } from '../../contexts/AppTemplateContext';
import { useActions } from '../../actions';

import { Identicon } from '../Controls/Identicon';
import { Confirm } from '../Controls/Confirm';
import { ErrorMsg } from '../Controls/ErrorMsg';
import { NewAddress } from './NewAddress';

const useStyles = makeStyles(theme => ({
  identicon: {
    height: 100,
    width: 100,
    //borderRadius: 200,
  },
}));

export const Addresses = () => {
  const classes = useStyles();
  const template = useAppTemplate();
  const { addresses } = template;
  const { deleteAddress } = useActions();
  const [error, setError] = useState(null);

  const onDelete = ({address, network}) => {
    try {
      deleteAddress({address, network});
    } catch (err) {
      setError(err.toString());
    }
  };

  const noAddresses = addresses.length === 0 ? <div>No Addresses.  Add one below</div> : undefined;
  const errMsg = error ? <ErrorMsg message={error} /> : undefined;

  return (
    <div>
      { errMsg }
      <Card>
        <CardHeader title="Addresses" />
        <CardContent>
          { noAddresses }
          <List dense={false}>
            { addresses && addresses.map(address => (
              <ListItem key={address.address}>
                <ListItemAvatar>
                  <Avatar>
                    <Identicon address={address.address} pixelWidth={42} className={classes.identicon} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={address.name ? <Link to={`/_/addresses/${address.network}/${address.address}`}>{ address.name }</Link>: <span><Link to={`/_/addresses/${address.network}/${address.address}`}>{ address.address}{' '}</Link><Chip label={address.network} variant="outlined" size="small" /></span>}
                  secondary={address.name ? <span>{ address.address }{' '}<Chip label={address.network} variant="outlined" size="small" /></span> : null }
                />
                <ListItemSecondaryAction>
                  <Confirm onConfirm={() => onDelete(address)} title="Delete Address" description="Remove address from address book?">
                    <IconButton edge="end" aria-label="delete" >
                      <DeleteIcon />
                    </IconButton>
                  </Confirm>
                </ListItemSecondaryAction>
              </ListItem>
            )) }
          </List>

          <NewAddress />

        </CardContent>

      </Card>
    </div>
  );
}
