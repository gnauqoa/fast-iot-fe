import { NodePropertiesType } from '@/interfaces/node';
import StringProperty from '../../node-menu/properties/string';

export const LabelProperties: NodePropertiesType = ({ data, onDataChange }) => {
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
    </div>
  );
};
