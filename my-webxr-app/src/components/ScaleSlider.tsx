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
    <div>
      <input
        type="range"
        min="10"
        max="100"
        step="1"
        value={scale}
        onChange={handleScaleChange}
      />
      <p>
        Scale:
        {' '}
        {scale}
      </p>
    </div>
  );
}

export default ScaleSlider;
