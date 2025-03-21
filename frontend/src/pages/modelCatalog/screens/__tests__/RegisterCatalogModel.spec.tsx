import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ModelRegistrySelectorContext } from '~/concepts/modelRegistry/context/ModelRegistrySelectorContext';
import { ModelCatalogContext } from '~/concepts/modelCatalog/context/ModelCatalogContext';
import RegisterCatalogModel from '../RegisterCatalogModel';
import { CatalogModelDetailsParams } from '~/pages/modelCatalog/types';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({
    sourceName: 'test-source',
    repositoryName: 'test-repo',
    modelName: 'test-model',
    tag: 'v1',
  }),
}));
jest.mock('~/pages/modelCatalog/utils', () => ({
  findModelFromModelCatalogSources: () => ({
    repository: 'test-repo',
    name: 'test-model',
    artifacts: [{ tags: ['v1'] }],
  }),
  decodeParams: (params: CatalogModelDetailsParams) => params,
  createCustomPropertiesFromModel: () => ({}),
  getTagFromModel: () => 'v1',
}));
jest.mock('~/redux/hooks', () => ({
  useAppSelector: () => 'test-user',
}));

const selectorContextValue = {
  preferredModelRegistry: {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: 'test-registry',
      namespace: 'test-namespace',
    },
    spec: {
      selector: { app: 'test-app', component: 'test-component' },
      ports: [],
    },
  },
  modelRegistryServicesLoaded: true,
  modelRegistryServices: [],
  updatePreferredModelRegistry: jest.fn(),
  refreshRulesReview: jest.fn(),
};

const catalogContextValue = {
  modelCatalogSources: {
    data: [{ source: 'test-source', models: [{ repository: 'test-repo', name: 'test-model' }] }],
    loaded: true,
    error: undefined,
    refresh: jest.fn(),
  },
};

const renderRegisterCatalogModel = () =>
  render(
    <BrowserRouter>
      <ModelRegistrySelectorContext.Provider value={selectorContextValue}>
        <ModelCatalogContext.Provider value={catalogContextValue}>
          <RegisterCatalogModel />
        </ModelCatalogContext.Provider>
      </ModelRegistrySelectorContext.Provider>
    </BrowserRouter>,
  );

describe('RegisterCatalogModel', () => {
  it('preserves model name field value on re-render after user edit', () => {
    const { rerender } = renderRegisterCatalogModel();

    const modelNameInput = screen.getByRole('textbox', { name: 'Model name' });
    expect(modelNameInput).toHaveValue('test-model-v1');

    fireEvent.change(modelNameInput, { target: { value: 'user-edited-model' } });
    expect(modelNameInput).toHaveValue('user-edited-model');

    rerender(
      <BrowserRouter>
        <ModelRegistrySelectorContext.Provider value={selectorContextValue}>
          <ModelCatalogContext.Provider value={catalogContextValue}>
            <RegisterCatalogModel />
          </ModelCatalogContext.Provider>
        </ModelRegistrySelectorContext.Provider>
      </BrowserRouter>,
    );

    expect(modelNameInput).toHaveValue('user-edited-model');
  });
});