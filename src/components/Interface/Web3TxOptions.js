import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

import { useAddresses } from 'contexts/AppTemplateContext';
import { useActions } from 'actions';
import { SelectField } from 'components/Controls/SelectField';

import { NETWORKS } from '../../constants';
import { useContractByAddress } from 'lib/web3';

export const Web3TxOptions = ({ onCreate, onCancel }) => {
  const addresses = useAddresses();
  const { addComponent } = useActions();
  const [address, setAddress] = useState();

  const addressOptions = Object.keys(addresses || {}).map(a => ({value: {network: addresses[a].network, address: a}, label: `${addresses[a].network} ${a}`}));
  //const networkOptions = Object.keys(NETWORKS).map(n => ({value: n, label: NETWORKS[n].name}));

  const [fields, form] = useForm({
    fields: [
      {name: 'address', label: 'Address', type: 'select', options: addressOptions},
    ],
    submit: values => {
      const { address, network } = values.get('address');
      onCreate({
        type: 'web3transaction',
        address,
        network,
        signature: values.get('function'),
      });
      onCancel();
    },
  });

  const abi = fields.address.value !== '' ? addresses[fields.address.value.address].abi : undefined;

  const addAddressLink = addresses ? undefined : <div>
    <Link to="/_/settings/addresses">
      Add an Ethereum contract to the address book in order to interact with it.
    </Link>
  </div>;

  return (
    <div>
      <form.Form>
        <Card>
          <CardHeader title="New Web3 Transaction" />
          <CardContent>
            { addAddressLink }

            <SelectField {...fields.address} />

            { fields.address.value !== '' ?
                <SelectFunction {...fields.function } address={fields.address.value.address} abi={abi} form={form} fields={fields} />
                :
                undefined
            }

          </CardContent>

          <CardActions>
            <Button variant="outlined" color="primary" onClick={form.submit}>Save</Button>
            <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          </CardActions>

        </Card>
      </form.Form>
    </div>
  )

};

const SelectFunction = ({ address, abi, form, fields, ...rest }) => {
  const contract = useContractByAddress(address);

  const queries = Object.filter(
    contract.interface.functions,
    i => i.type === "transaction" || i.type === 'call'
  );

  let queryFuncs = [];
  Object.keys(queries).forEach(q => {
    if (q.indexOf("(") > 0) {
      queryFuncs.push({value: queries[q].signature, label: queries[q].signature});
    }
  });

  useEffect(() => {
    form.addField(
      {name: 'function', label: 'Function', type: 'select', options: queryFuncs}
    );
  }, []);

  if (!fields.function) { return null; }

  return <SelectField {...fields.function } {...rest} />
};