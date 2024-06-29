/**
 * Created by Prateek Jain on 2020-02-04.
 */
import { TextInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/TextInput';
import { StatefulPopover } from '@sprinklrjs/spaceweb/popover';

//lib
import immutablyUpdate2 from 'aimmutability-helper';
import _reduce from 'lodash/reduce';
import { useMemo } from 'react';
import { memo } from 'react';

//components
import { ErrorPlaceholder, ErrorPlaceholderProps } from '@sprinklrjs/modules/platform/components/ErrorPlaceholder';

//hooks
import { useProcessEngineActionOptions } from './useProcessEngineActionOptions';
import { useExecuteActionTranslation } from '@sprinklrjs/modules/processEngine/elements/executeAction/i18n';
import { useStyle } from '@sprinklrjs/spaceweb/style';
import { FieldConfigBuilder, FieldConfigMap, FieldConfigMapBuilder } from '@sprinklrjs/spaceweb-form';
import socialAssetReader from 'core/entityReaders/SocialAsset';

//types

/*
dsfsdfs\
*/
import type { Field } from '@sprinklrjs/dynamic-form/types';
import type { FormField, FormSection } from '@sprinklrjs/modules/infra/types/layout/formLayout';
import { PlaceholderVariants } from '@sprinklrjs/modules/platform/types/placeholder';

//utils|helpers
import { getFormFieldComponentAndComponentProps, getFormSectionComponentAndComponentProps } from '../helpers';
import { Menu, NestedMenuProvider } from '@sprinklrjs/spaceweb/menu';
import mediaTypes from '@sprinklrjs/legacy-base/lib/constants/mediaTypes';

//constants
import { STATIC_FIELD_KEYS } from '../constants';
import { ELEMENT_TYPES } from '@sprinklrjs/modules/infra/field/constants';
import { ADD_ASSET_TO_ENTITY } from 'modules/campaign/actions/actionTypes';
import { SelectInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/SelectInput';
