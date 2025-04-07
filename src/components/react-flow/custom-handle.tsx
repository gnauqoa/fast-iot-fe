import { HandleType, Position } from '@xyflow/react';
import { LabeledHandle } from './labeled-handle';

const CustomHandle = ({
  position,
  title,
  id,
  type,
  handleConnectedIds,
}: {
  title: string;
  id: string;
  position: Position;
  type: HandleType;
  handleConnectedIds?: string[];
}) => {
  return (
    <LabeledHandle
      labelClassName={`px-0 absolute bottom-1 ${position === Position.Right ? 'left-3' : 'right-3'}`}
      handleClassName={
        handleConnectedIds?.includes(id) ? 'custom-handle connected' : 'custom-handle'
      }
      id={id}
      title={title}
      type={type}
      position={position}
    />
  );
};

export default CustomHandle;
