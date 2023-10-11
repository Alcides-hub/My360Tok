import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Gyroscope } from 'expo-sensors';

const useGyroscope = (callback) => {
  useEffect(() => {
    let isMounted = true;

    const handleGyroscopeData = ({ x, y, z }) => {
      if (isMounted) {
        callback({ x, y, z });
      }
    };

    Gyroscope.addListener(handleGyroscopeData);
    Gyroscope.setUpdateInterval(16); // Adjust the update interval as needed (e.g., 16ms for 60 FPS)

    return () => {
      isMounted = false;
      Gyroscope.removeAllListeners();
    };
  }, [callback]);
};

// Define a low-pass filter to smooth the gyroscope data
const lowPassFilter = (newValue, oldValue, alpha) => {
  return oldValue + alpha * (newValue - oldValue);
};

function CameraControls() {
  const { camera } = useThree();
  const gyroscopeData = useRef({ x: 0, y: 0, z: 0 });
  const previousRotation = useRef(new THREE.Quaternion());

  // Initialize the gyroscope sensor
  useGyroscope((data) => {
    gyroscopeData.current = {
      x: lowPassFilter(data.x, gyroscopeData.current.x, 0.1), // Adjust the alpha value for smoothing
      y: lowPassFilter(data.y, gyroscopeData.current.y, 0.1),
      z: lowPassFilter(data.z, gyroscopeData.current.z, 0.1),
    };
  });

  useFrame(() => {
    const { x, y, z } = gyroscopeData.current;
    
    // Update camera rotation here using x, y, z values
    // For example, you can use Quaternion rotations to rotate the camera
    const rotationQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(y, x, 0, 'XYZ')
    );

    // Use a lower slerp factor for smoother camera movement
    camera.quaternion.slerp(rotationQuaternion, 0.05); // Adjust the factor as needed
  });

  return null;
}

function ImageSphere() {
  const mesh = useRef();
  const texture = new THREE.TextureLoader().load(require('../assets/Tokkaido1.jpg'));

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[6, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CameraControls />
        <ImageSphere />
      </Canvas>
    </View>
  );
}
