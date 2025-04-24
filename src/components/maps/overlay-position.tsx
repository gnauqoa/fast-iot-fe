interface OverlayPositionProps {
  coordinates: [number, number] | null;
}

export const OverlayPosition: React.FC<OverlayPositionProps> = ({ coordinates }) => {
  if (!coordinates) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div>Latitude: {coordinates[0].toFixed(6)}</div>
      <div>Longitude: {coordinates[1].toFixed(6)}</div>
    </div>
  );
};
