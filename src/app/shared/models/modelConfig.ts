export const commonColumns = [
  'description',
  'license',
  'same_as',
  'relevant_link',
];

export const distributionColumns = [
  'distribution',
  'distribution.name',
  'distribution.dependency',
  'distribution.checksum',
  'distribution.description',
  'distribution.checksum_algorithm',
  'distribution.content_url',
  'distribution.content_size_kb',
  'distribution.encoding_format',
  'distribution.platform',
];

export const mediaColumns = [
  'media',
  'media.name',
  'media.description',
  'media.checksum',
  'media.checksum_algorithm',
  'media.content_size_kb',
  'media.content_url',
  'media.copyright',
  'media.date_published',
];

export const modelConfig = {
  AIModel: {
    columns: [
      ...commonColumns,
      ...mediaColumns,
      ...distributionColumns,
      'distribution.technology_readiness_level',
      'distribution.hardware_requirement',
      'distribution.os_requirement',
      'distribution.installation',
      'distribution.installation_script',
      'distribution.deployment',
      'distribution.deployment_script',
    ],
    title: 'AI Model',
  },
  Dataset: {
    columns: [...commonColumns, ...distributionColumns],
    title: 'Dataset',
  },
  Experiment: {
    columns: [
      ...commonColumns,
      ...distributionColumns,
      ...mediaColumns,
      'execution_settings',
      'badge',
    ],
    title: 'Experiment',
  },
  'Educational resource': {
    columns: [
      ...commonColumns,
      ...distributionColumns,
      ...mediaColumns,
      'relevant_link',
      'type',
      'target_audience',
      'target_groups',
    ],
    title: 'Educational Resource',
  },
  Publication: {
    columns: [
      ...commonColumns,
      ...distributionColumns,
      ...mediaColumns,
      'type',
    ],
    title: 'Publication',
  },
  'Success stories': {
    columns: [...commonColumns, ...mediaColumns, ...distributionColumns],
    title: 'Success Stories',
  },
  'Resource Bundle': {
    columns: [...commonColumns, ...distributionColumns, ...mediaColumns],
    title: 'Resource Bundle',
  },
};
