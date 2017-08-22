import './milestones.less';
import './milestones_controller';
import './milestones_vis_params';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { CATEGORY } from 'ui/vis/vis_category';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';
import milestonesTemplate from './milestones_controller.html';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/icon-milestones.svg';

VisTypesRegistryProvider.register(function MilestonesProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const Schemas = Private(VisSchemasProvider);

  return VisFactory.createAngularVisualization({
    name: 'milestones',
    title: 'Milestones',
    image,
    description: 'A timeline of events with labels.',
    category: CATEGORY.TIME,
    visConfig: {
      defaults: {
        mapping_timestamp: 'timestamp',
        mapping_text: 'text',
        optimize: true,
        // e.g. "2017-02-07T03:00:00.000+01:00"
        parseTime: '%Y-%m-%dT%H:%M:%S',
        aggregate: 'day',
        anotherOption: true
      },
      template: milestonesTemplate,
    },
    responseHandler: 'none',
    editorConfig: {
      collections: {
        aggregate: ['second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year']
      },
      optionsTemplate: '<milestones-vis-params></milestones-vis-params>',
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'top_hits',
          title: 'Top Hits',
          min: 1,
          max: 1,
          aggFilter: ['top_hits'],
          defaults: [
            { schema: 'top_hits', type: 'top_hits',  params: { field: '_score', aggregate: { val: 'min' }, size: 3, sortOrder: 'asc' } }
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'X-Axis',
          min: 0,
          max: 1,
          aggFilter: 'date_histogram',
          defaults: [
            { schema: 'segment', type: 'date_histogram' }
          ]
        },
        {
          group: 'buckets',
          name: 'categories',
          title: 'Categorization',
          min: 0,
          max: 1,
          aggFilter: ['terms']
        },
      ])
    },
    hierarchicalData: true
  });
});