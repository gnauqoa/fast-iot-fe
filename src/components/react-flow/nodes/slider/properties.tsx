import { NodePropertiesType } from '@/interfaces/node';
import StringProperty from '../../node-menu/properties/string';
import NumberProperty from '../../node-menu/properties/number';

export const SliderProperties: NodePropertiesType = ({ data, onDataChange }) => {
  return (
    <div className="flex flex-col gap-4 px-3">
      <StringProperty
        label="Label"
        name="label"
        value={data.label}
        onChange={event => onDataChange([{ key: 'label', value: event.currentTarget.value }])}
      />

      <StringProperty
        label="Channel"
        name="channel"
        value={data.channel}
        onChange={event => onDataChange([{ key: 'channel', value: event.currentTarget.value }])}
      />

      <NumberProperty
        label="Min"
        name="min"
        value={data.min ?? 0}
        onChange={event => onDataChange([{ key: 'min', value: Number(event.currentTarget.value) }])}
      />

      <NumberProperty
        label="Max"
        name="max"
        value={data.max ?? 100}
        onChange={event => onDataChange([{ key: 'max', value: Number(event.currentTarget.value) }])}
      />

      <NumberProperty
        label="Step"
        name="step"
        value={data.step ?? 1}
        onChange={event =>
          onDataChange([{ key: 'step', value: Number(event.currentTarget.value) }])
        }
      />
    </div>
  );
};
