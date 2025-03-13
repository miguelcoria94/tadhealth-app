declare module 'react-native-particle-background' {
  interface ParticlesProps {
    count?: number;
    touchStart?: boolean;
    particleSize?: number;
    opacity?: number;
    velocity?: number;
    colors?: string[];
  }
  
  const Particles: React.FC<ParticlesProps>;
  export default Particles;
} 