import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, MeshTransmissionMaterial, Center } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useControls } from 'leva';

const Scene = () => {
  const circularTextRef = useRef();

  const {
    glassThickness,
    glassRoughness,
    chromaticAberration,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
  } = useControls({
    glassThickness: { value: 0.2, min: 0, max: 1 },
    glassRoughness: { value: 0.1, min: 0, max: 1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    bloomStrength: { value: 1.2, min: 0, max: 5 },
    bloomRadius: { value: 0.6, min: 0, max: 2 },
    bloomThreshold: { value: 0.2, min: 0, max: 1 },
  });

  useFrame(({ clock }) => {
    if (circularTextRef.current) {
      circularTextRef.current.rotation.z = -clock.getElapsedTime() * 0.2;
    }
  });

  const text = "VISUAL-STUDIO-CODER • ";
  const radius = 3.5;
  const characters = text.split('');

  return (
    <>
      <color attach="background" args={['#111']} />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#4444ff" />
      <spotLight position={[0, 10, 0]} intensity={2} penumbra={1} />

      <Center>
        <Text3D font="/inter.json" size={2} height={0.5} curveSegments={12} bevelEnabled bevelThickness={0.1} bevelSize={0.05} bevelOffset={0} bevelSegments={5}>
          VS
          <MeshTransmissionMaterial
            thickness={glassThickness}
            roughness={glassRoughness}
            chromaticAberration={chromaticAberration}
            anisotropicBlur={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.2}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            background={new THREE.Color('#111')}
          />
        </Text3D>
      </Center>

      <group ref={circularTextRef}>
        {characters.map((char, i) => {
          const angle = (i / characters.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <group key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
                <Text3D font="/inter.json" size={0.4} height={0.1} position={[-0.2, 0, 0]}>
                {char}
                <meshStandardMaterial color="#90caf9" emissive="#90caf9" emissiveIntensity={2} toneMapped={false} />
                </Text3D>
            </group>
          );
        })}
      </group>

      <EffectComposer>
        <Bloom
          intensity={bloomStrength}
          radius={bloomRadius}
          threshold={bloomThreshold}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
      <OrbitControls makeDefault />
    </>
  );
};

export default Scene;
