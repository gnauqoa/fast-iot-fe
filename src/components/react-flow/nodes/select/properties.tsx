import { NodePropertiesType } from '@/interfaces/node';
import StringProperty from '../../node-menu/properties/string';
import ChannelProperty from '../../node-menu/properties/channel';
import { Button, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IChannelDefinition } from '@/interfaces/template';

interface SelectOption {
  label: string;
  value: string;
}

export const SelectProperties: NodePropertiesType = ({ data, onDataChange }) => {
  const handleOptionChange = (index: number, field: 'label' | 'value', newValue: string) => {
    const newOptions = [...(data.options || [])];
    newOptions[index] = {
      ...newOptions[index],
      [field]: newValue,
    };
    onDataChange([{ key: 'options', value: newOptions }]);
  };

  const addOption = () => {
    const newOptions = [...(data.options || []), { label: '', value: '' }];
    onDataChange([{ key: 'options', value: newOptions }]);
  };

  const removeOption = (index: number) => {
    const newOptions = [...(data.options || [])];
    newOptions.splice(index, 1);
    onDataChange([{ key: 'options', value: newOptions }]);
  };

  const existingChannelNames =
    data.existingChannels?.map((channel: IChannelDefinition) => channel.name) || [];

  const handleChannelChange = (value: string) => {
    const selectedChannel = data.existingChannels?.find(
      (channel: IChannelDefinition) => channel.name === value
    );
    if (selectedChannel?.options) {
      onDataChange([
        { key: 'channel', value },
        { key: 'options', value: selectedChannel.options },
      ]);
    } else {
      onDataChange([
        { key: 'channel', value },
        { key: 'options', value: [] },
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-3">
      <StringProperty
        label="Label"
        name="label"
        value={data.label}
        onChange={event => onDataChange([{ key: 'label', value: event.currentTarget.value }])}
      />

      <ChannelProperty
        label="Channel"
        name="channel"
        value={data.channel}
        onValueChange={handleChannelChange}
        existingChannels={existingChannelNames}
      />

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium" id="options-label">
          Options
        </div>
        <div className="flex flex-col gap-2" role="group" aria-labelledby="options-label">
          {(data.options || []).map((option: SelectOption, index: number) => (
            <Space key={index} align="baseline">
              <Input
                placeholder="Label"
                value={option.label}
                onChange={e => handleOptionChange(index, 'label', e.target.value)}
                style={{ width: 120 }}
                aria-label={`Option ${index + 1} label`}
              />
              <Input
                placeholder="Value"
                value={option.value}
                onChange={e => handleOptionChange(index, 'value', e.target.value)}
                style={{ width: 120 }}
                aria-label={`Option ${index + 1} value`}
              />
              <MinusCircleOutlined
                className="text-red-500 cursor-pointer"
                onClick={() => removeOption(index)}
                aria-label={`Remove option ${index + 1}`}
              />
            </Space>
          ))}
          <Button type="dashed" onClick={addOption} icon={<PlusOutlined />} className="mt-2">
            Add Option
          </Button>
        </div>
      </div>
    </div>
  );
};
