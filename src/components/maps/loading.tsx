import React from 'react';
import { Spin } from 'antd';

interface LoadingProps {
  isLoading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      zIndex: 1000
    }}>
      <Spin size="large" tip="Scanning for devices..." />
    </div>
  );
};

