import { ChangeEvent } from 'react';

type ScaleSliderProps = {
  scale: number;
  setScale: (scale: number) => void;
};

type SliderEvent = ChangeEvent<HTMLInputElement>;

function ScaleSlider({ scale, setScale } : ScaleSliderProps) {
  const handleScaleChange = (event: SliderEvent) => {
    setScale(Number(event.target.value));
  };

  return (
    <div data-testid="ScaleSliderComponent">
      <input
        type="range"
        min="1"
        max="10"
        step="0.1"
        value={scale}
        onChange={handleScaleChange}
        data-testid="slider"
      />
      <p data-testid="text">
        Scale:
        {' '}
        {scale}
      </p>
    </div>
  );
}

export default ScaleSlider;
