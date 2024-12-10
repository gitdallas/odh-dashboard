import React, { useState } from 'react';
import { FormGroup, Radio, Alert, MenuItem, MenuGroup } from '@patternfly/react-core';
import SearchSelector from '~/components/searchSelector/SearchSelector';
import { translateDisplayNameForK8s } from '~/concepts/k8s/utils';
import { PemFileUpload } from './PemFileUpload';

export enum SecureDBRadios {
  CLUSTER_WIDE = 'cluster-wide',
  OPENSHIFT = 'openshift',
  EXISTING = 'existing',
  NEW = 'new',
}

export interface SecureDBInfo {
  radio: SecureDBRadios;
  configMap: string;
  key: string;
  certificate: string;
  nameSpace: string;
}

interface CreateMRSecureDBSectionProps {
  secureDBInfo: SecureDBInfo;
  handleSecureDBTypeChange: (type: SecureDBRadios) => void;
  modelRegistryNamespace: string;
  nameDesc: { name: string };
  existingCertKeys: string[];
  existingCertConfigMaps: string[];
  existingCertSecrets: string[];
  setSecureDBInfo: (info: SecureDBInfo) => void;
}

export const CreateMRSecureDBSection: React.FC<CreateMRSecureDBSectionProps> = ({
  secureDBInfo,
  handleSecureDBTypeChange,
  modelRegistryNamespace,
  nameDesc,
  existingCertKeys,
  existingCertConfigMaps,
  existingCertSecrets,
  setSecureDBInfo,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const getFilteredExistingCAResources = () => (
    <>
      <MenuGroup label="ConfigMaps">
        {existingCertConfigMaps
          .filter((configMap) => configMap.toLowerCase().includes(searchValue.toLowerCase()))
          .map((configMap, index) => (
            <MenuItem
              key={`configmap-${index}`}
              onClick={() => {
                setSearchValue('');
                setSecureDBInfo({
                  ...secureDBInfo,
                  configMap,
                  key: '',
                });
              }}
            >
              {configMap}
            </MenuItem>
          ))}
      </MenuGroup>
      <MenuGroup label="Secrets">
        {existingCertSecrets
          .filter((secret) => secret.toLowerCase().includes(searchValue.toLowerCase()))
          .map((secret, index) => (
            <MenuItem
              key={`secret-${index}`}
              onClick={() => {
                setSearchValue('');
                setSecureDBInfo({
                  ...secureDBInfo,
                  configMap: secret,
                  key: '',
                });
              }}
            >
              {secret}
            </MenuItem>
          ))}
      </MenuGroup>
    </>
  );

  return (
    <>
      <Radio
        isChecked={secureDBInfo.radio === SecureDBRadios.CLUSTER_WIDE}
        name="cluster-wide-ca"
        onChange={() => handleSecureDBTypeChange(SecureDBRadios.CLUSTER_WIDE)}
        label="Use cluster-wide CA bundle"
        description={
          <>
            Use the <strong>ca-bundle.crt</strong> bundle in the{' '}
            <strong>odh-trusted-ca-bundle</strong> ConfigMap.
          </>
        }
        id="cluster-wide-ca"
      />
      <Radio
        isChecked={secureDBInfo.radio === SecureDBRadios.OPENSHIFT}
        name="openshift-ca"
        onChange={() => handleSecureDBTypeChange(SecureDBRadios.OPENSHIFT)}
        label="Use OpenShift AI CA bundle"
        description={
          <>
            Use the <strong>odh-ca-bundle.crt</strong> bundle in the{' '}
            <strong>odh-trusted-ca-bundle</strong> ConfigMap.
          </>
        }
        id="openshift-ca"
      />
      <Radio
        isChecked={secureDBInfo.radio === SecureDBRadios.EXISTING}
        name="existing-ca"
        onChange={() => handleSecureDBTypeChange(SecureDBRadios.EXISTING)}
        label="Choose from existing certificates"
        description={
          <>
            You can select the key of any ConfigMap or Secret in the{' '}
            <strong>{modelRegistryNamespace}</strong> namespace.
          </>
        }
        id="existing-ca"
      />
      {secureDBInfo.radio === SecureDBRadios.EXISTING && (
        <>
          <FormGroup
            label="Resource"
            isRequired
            fieldId="existing-ca-resource"
            style={{ marginLeft: 'var(--pf-t--global--spacer--lg)' }}
          >
            <SearchSelector
              isFullWidth
              dataTestId="existing-ca-resource-selector"
              onSearchChange={(newValue) => setSearchValue(newValue)}
              onSearchClear={() => setSearchValue('')}
              searchValue={searchValue}
              toggleText={secureDBInfo.configMap || 'Select a ConfigMap or a Secret'}
            >
              {getFilteredExistingCAResources()}
            </SearchSelector>
          </FormGroup>
          <FormGroup
            label="Key"
            isRequired
            fieldId="existing-ca-key"
            style={{ marginLeft: 'var(--pf-t--global--spacer--lg)' }}
          >
            <SearchSelector
              isFullWidth
              dataTestId="existing-ca-key-selector"
              onSearchChange={(newValue) => setSearchValue(newValue)}
              onSearchClear={() => setSearchValue('')}
              searchValue={searchValue}
              toggleText={secureDBInfo.key || 'Select a key'}
            >
              {existingCertKeys
                .filter((item) => item.toLowerCase().includes(searchValue.toLowerCase()))
                .map((item, index) => (
                  <MenuItem
                    key={`key-${index}`}
                    onClick={() => {
                      setSearchValue('');
                      setSecureDBInfo({ ...secureDBInfo, key: item });
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
            </SearchSelector>
          </FormGroup>
        </>
      )}
      <Radio
        isChecked={secureDBInfo.radio === SecureDBRadios.NEW}
        name="new-ca"
        onChange={() => handleSecureDBTypeChange(SecureDBRadios.NEW)}
        label="Upload new certificate"
        id="new-ca"
      />
      {secureDBInfo.radio === SecureDBRadios.NEW && (
        <>
          <Alert
            isInline
            title="Note"
            variant="info"
            style={{ marginLeft: 'var(--pf-t--global--spacer--lg)' }}
          >
            Uploading a certificate below creates the{' '}
            <strong>{translateDisplayNameForK8s(nameDesc.name)}-db-credential</strong> ConfigMap
            with the <strong>ca.crt</strong> key. If you'd like to upload the certificate as a
            Secret instead, see the documentation for more details.
          </Alert>
          <FormGroup
            label="Certificate"
            required
            style={{ marginLeft: 'var(--pf-t--global--spacer--lg)' }}
          >
            <PemFileUpload
              onChange={(value) => setSecureDBInfo({ ...secureDBInfo, certificate: value })}
            />
          </FormGroup>
        </>
      )}
    </>
  );
};
