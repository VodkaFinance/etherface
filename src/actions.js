import React from 'react';
import Ajv from 'ajv';
import slugify from 'slugify';

import { default as schema } from 'types/Template.json';

import { nextId } from './helpers';
import { AppTemplateStore } from './contexts/AppTemplateContext';

import { connectTheGraph } from './lib/thegraph';
import localstorage from './lib/localstorage';


const ajv = new Ajv({ allErrors: true });
ajv.addSchema(schema, 'template');

export const useActions = () => {
  const { dispatch, state } = React.useContext(AppTemplateStore);

  function loadAppTemplate(template, storage) {
    dispatch({ type: 'LOAD_TEMPLATE', payload: {template, storage} });
  }

  function editTemplate(template) {
    dispatch({ type: 'EDIT_TEMPLATE', payload: template});
  }

  function addTab(tab){
    if (!tab.slug) {
      tab.slug = slugify(tab.name);
    }

    // validations
    const valid = ajv.validate({ $ref: 'template#/definitions/Tab' }, tab);
    if (!valid) {
      const errorText =
        ajv.errorsText() && ajv.errorsText().toLowerCase() !== "no errors"
        ? ajv.errorsText()
        : "";
      throw new Error(errorText);
    }
    const existingBySlug = Object.filter(state.tabs, t => t.slug === tab.slug);

    dispatch({ type: 'ADD_TAB', payload: tab });
  }

  function editTab(tab) {
    dispatch({ type: 'EDIT_TAB', payload: tab});
  }

  function deleteTab(tab){
    dispatch({ type: 'DELETE_TAB', payload: tab });
  }

  function addPage(page){
    dispatch({ type: 'ADD_PAGE', payload: page });
  }

  function editPage(page) {
    dispatch({ type: 'EDIT_PAGE', payload: page});
  }

  function addIntegration(integration) {
    dispatch({ type: 'ADD_INTEGRATION', payload: integration });
  }

  function deleteIntegration(integration) {
    dispatch({ type: 'DELETE_INTEGRATION', payload: integration });
  }

  function connectIntegration(integration) {
    const __instance = ((type) => {
      switch (type) {
        case 'thegraph':
          return connectTheGraph(integration.endpoint);
        default:
          throw new Error ('Unsupported integration type: ', type);
      }
    })(integration.type);
    dispatch({ type: 'CONNECT_INTEGRATION', payload: {...integration, __instance}});
  }

  function addComponent(component) {
    dispatch({ type: 'ADD_COMPONENT', payload: component });
  }

  function editComponent(component) {
    dispatch({ type: 'EDIT_COMPONENT', payload: component});
  }

  function deleteComponent(component) {
    dispatch({ type: 'DELETE_COMPONENT', payload: component});
  }

  function addAddress(address) {
    dispatch({ type: 'ADD_ADDRESS', payload: address});
  }

  function editAddress(address) {
    dispatch({ type: 'EDIT_ADDRESS', payload: address});
  }

  function deleteAddress(address) {
    dispatch({ type: 'DELETE_ADDRESS', payload: address});
  }

  function loadSettings() {
    const settings = localstorage.loadSettings();
    dispatch({ type: 'LOAD_SETTINGS', payload: settings});
  };

  function setSetting(setting, value) {
    localstorage.setSetting(setting, value);
    dispatch({ type: 'SET_SETTING', payload: {setting, value}});
  }

  return {
    loadAppTemplate,
    editTemplate,
    addTab,
    editTab,
    deleteTab,
    addPage,
    editPage,
    addIntegration,
    deleteIntegration,
    connectIntegration,
    addComponent,
    editComponent,
    deleteComponent,
    addAddress,
    deleteAddress,
    editAddress,
    loadSettings,
    setSetting,
  };
};
