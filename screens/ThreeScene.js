import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';

function ImageSphere() {
  const mesh = useRef();
  const texture = new THREE.TextureLoader().load(require('../assets/Tokkaido1.jpg'));

//   useFrame(() => {
//     mesh.current.rotation.x += 0.005;
//     mesh.current.rotation.y += 0.005;
//   });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas style={{ background: '#727272' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <ImageSphere />
    </Canvas>
  );
}

